// config/db.js - PostgreSQL Database Connection & Schema Introspection
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.PG_HOST || 'localhost',
  port: parseInt(process.env.PG_PORT || '5432', 10),
  database: process.env.PG_DATABASE || 'company_db',
  user: process.env.PG_USER || 'postgres',
  password: process.env.PG_PASSWORD || 'postgres',
  max: 10, // maximum pool connections
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,
});

pool.on('connect', () => {
  console.log('✅ Connected to PostgreSQL Database');
});

pool.on('error', (err) => {
  console.error('❌ Unexpected PostgreSQL client error:', err.message);
});

/**
 * Dynamically queries PostgreSQL information_schema to extract current table structures
 * This schema string is injected into the Gemini AI prompt.
 */
async function getDatabaseSchema() {
  const query = `
    SELECT 
      table_name, 
      column_name, 
      data_type 
    FROM information_schema.columns 
    WHERE table_schema = 'public' 
    ORDER BY table_name, ordinal_position;
  `;

  try {
    const res = await pool.query(query);
    if (!res.rows || res.rows.length === 0) {
      // Fallback default schema for development/offline testing
      return `
Table: departments (id SERIAL PRIMARY KEY, dept_name VARCHAR, location VARCHAR, budget NUMERIC)
Table: employees (id SERIAL PRIMARY KEY, name VARCHAR, email VARCHAR, role VARCHAR, salary NUMERIC, department_id INT REFERENCES departments(id), hire_date DATE)
Table: projects (id SERIAL PRIMARY KEY, project_name VARCHAR, department_id INT REFERENCES departments(id), status VARCHAR, deadline DATE)
      `.trim();
    }

    // Group columns by table
    const tables = {};
    res.rows.forEach(row => {
      if (!tables[row.table_name]) tables[row.table_name] = [];
      tables[row.table_name].push(`${row.column_name} (${row.data_type})`);
    });

    return Object.entries(tables)
      .map(([table, cols]) => `Table ${table}: ${cols.join(', ')}`)
      .join('\n');
  } catch (error) {
    console.warn('⚠️ Could not introspect database schema directly, using cached schema:', error.message);
    return `
Table: departments (id SERIAL PRIMARY KEY, dept_name VARCHAR, location VARCHAR, budget NUMERIC)
Table: employees (id SERIAL PRIMARY KEY, name VARCHAR, email VARCHAR, role VARCHAR, salary NUMERIC, department_id INT REFERENCES departments(id), hire_date DATE)
Table: projects (id SERIAL PRIMARY KEY, project_name VARCHAR, department_id INT REFERENCES departments(id), status VARCHAR, deadline DATE)
    `.trim();
  }
}

module.exports = {
  pool,
  getDatabaseSchema,
};
