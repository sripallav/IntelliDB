// middlewares/securityGuard.js - Multi-Tier Security Guardrail for SQL Queries

const FORBIDDEN_KEYWORDS = [
  'DROP',
  'DELETE',
  'TRUNCATE',
  'ALTER',
  'UPDATE',
  'INSERT',
  'GRANT',
  'REVOKE',
  'EXEC',
  'EXECUTE',
  'CREATE',
];

/**
 * Validates generated SQL query to ensure it is strictly READ-ONLY.
 * Rejects destructive SQL commands before they reach PostgreSQL.
 */
function validateSQLSecurity(sqlQuery) {
  if (!sqlQuery || typeof sqlQuery !== 'string') {
    return {
      isValid: false,
      reason: 'Invalid or empty SQL query received.',
    };
  }

  const cleanedQuery = sqlQuery.trim();

  // 1. Must start with SELECT or WITH (for Common Table Expressions)
  const isSelect = /^SELECT\b/i.test(cleanedQuery) || /^WITH\b/i.test(cleanedQuery);
  if (!isSelect) {
    return {
      isValid: false,
      reason: 'Security Violation: Only read-only SELECT queries are allowed.',
    };
  }

  // 2. Check for blacklisted destructive keywords
  for (const keyword of FORBIDDEN_KEYWORDS) {
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    if (regex.test(cleanedQuery)) {
      return {
        isValid: false,
        reason: `Security Violation: Destructive operation '${keyword}' is strictly forbidden.`,
      };
    }
  }

  // 3. Reject multiple queries separated by semicolons (prevent piggyback SQL injection: "SELECT 1; DROP TABLE...")
  const statements = cleanedQuery.split(';').map(s => s.trim()).filter(Boolean);
  if (statements.length > 1) {
    return {
      isValid: false,
      reason: 'Security Violation: Multiple stacked SQL queries are not permitted.',
    };
  }

  return { isValid: true };
}

module.exports = {
  validateSQLSecurity,
};
