# IntelliDB — AI-Powered Natural Language to SQL Query Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Gemini API](https://img.shields.io/badge/AI%20Engine-Google%20Gemini-8E75C2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Java](https://img.shields.io/badge/Backend-Java%20%2F%20Spring%20Boot-ED8B00?logo=openjdk&logoColor=white)](https://spring.io/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql&logoColor=white)](https://www.mysql.com/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)

> **IntelliDB** is an intelligent database querying platform that translates plain English business questions into syntactically accurate, secure, and optimized SQL queries, enabling non-technical stakeholders (HR, Operations, Executives, Managers) to retrieve real-time insights from relational databases without writing a single line of SQL.

---

## 📌 Problem Statement

In most organizations, business managers, HR professionals, and non-technical decision-makers need ad-hoc data answers daily:
- *"Who are our top 5 highest-paid software engineers hired this year?"*
- *"Show me products that are running low in stock across Mumbai warehouses."*

Historically, these stakeholders must submit support tickets or email data analysts and software engineers, creating bottlenecks and delays of hours or days. 

**IntelliDB bridges this gap:** users type their questions in plain conversational language, and IntelliDB automatically infers the database structure, constructs the SQL query, executes it safely, and presents clean, interactive tabular results in seconds.

---

## 🚀 Key Features

- **Natural Language to SQL (NL-to-SQL)**: Translates human language into standard ANSI SQL for PostgreSQL and MySQL using Google Gemini API.
- **Dynamic Schema Introspection**: Reads catalog metadata (table names, columns, data types, primary/foreign keys) at runtime so prompts always match the actual schema.
- **Enterprise Security & Zero Data Leakage**:
  - **No sensitive row data is sent to the LLM** — only table schema definitions and column names are shared.
  - **Read-Only Guardrails**: Strictly rejects destructive commands (`DROP`, `DELETE`, `TRUNCATE`, `ALTER`, `UPDATE`, `INSERT`).
  - **SQL Injection Defense**: Sanitizes inputs and validates generated AST queries before execution.
- **Multi-Database Support**: Easily connect to either PostgreSQL or MySQL via configurable JDBC connection strings.
- **Query Explanation & Performance**: Explains *how* and *why* the query works, providing execution time and row counts.
- **Interactive UI**: Responsive React interface with tabular sorting, pagination, and CSV data export.

---

## 🏗️ System Architecture

```text
+-----------------------+
|  Business User / HR   |  "Show me top 5 highest salary employees"
+-----------+-----------+
            | (Plain English Query)
            v
+-----------------------+
|   React Frontend UI   |  Interactive Query Console & Results Table
+-----------+-----------+
            | (REST API Request)
            v
+-------------------------------------------------------+
|                IntelliDB Backend Engine               |
|                                                       |
|  1. Schema Extractor: Reads DB catalog metadata       |
|  2. Prompt Builder: Merges user query + DB schema     |
|  3. Gemini AI Engine: Synthesizes optimized SQL       |
|  4. Security Validator: Verifies READ-ONLY & Safe AST |
|  5. Query Runner: Executes query via JDBC Driver      |
+---------------------------+---------------------------+
            |               |
            | (Safe SQL)    | (LLM Inference)
            v               v
    +---------------+  +---------------------+
    | PostgreSQL /  |  |  Google Gemini API  |
    | MySQL Cluster |  +---------------------+
    +---------------+
```

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js, Vite, Tailwind CSS / Bootstrap, Axios |
| **Backend** | Java 17+, Spring Boot (or Node.js / Express), JDBC / Hibernate |
| **Databases** | PostgreSQL 15+, MySQL 8.0+ |
| **AI / LLM Engine** | Google Gemini API (`gemini-1.5-flash` / `gemini-pro`) |
| **Testing & Tools** | Postman, JUnit, Git, GitHub |

---

## 🔒 Security & Safe Execution Safeguards

To prevent accidental data corruption or malicious attacks, IntelliDB implements multi-tier guardrails:

1. **Strict Read-Only Filter**: A regex and AST parser ensures only `SELECT` statements are permitted. Destructive statements (`DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`, `GRANT`) trigger an immediate HTTP `403 Forbidden` response.
2. **Metadata-Only AI Context**: The LLM never sees actual customer or business records. Only table definitions (`CREATE TABLE ...`) are supplied in the system prompt.
3. **Execution Timeout**: Enforces a strict 5-second query timeout to prevent runaway queries or recursive joins.

---

## 💻 Getting Started

### Prerequisites
- Java 17+ (or Node.js 18+)
- PostgreSQL or MySQL installed locally or hosted (e.g., Supabase, Neon, AWS RDS)
- Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sripallav/IntelliDB.git
   cd IntelliDB
   ```

2. **Configure Environment Variables:**
   Create an `.env` or `application.properties` file:
   ```properties
   # AI Configuration
   GEMINI_API_KEY=your_gemini_api_key_here

   # Database Connection
   DB_TYPE=postgresql
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=company_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   ```

3. **Run Backend Service:**
   ```bash
   # If Java / Spring Boot
   ./mvnw spring-boot:run

   # If Node.js backend
   npm install && npm start
   ```

4. **Run Frontend Application:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

5. Open your browser at `http://localhost:5173`.

---

## 📖 Example Usage

| User Input (Plain English) | Generated SQL Query | Output |
|---|---|---|
| *"Who are the top 5 highest earning employees?"* | `SELECT id, name, department, salary FROM employees ORDER BY salary DESC LIMIT 5;` | Displays clean table of top 5 employees with salaries. |
| *"Count how many projects each department is handling."* | `SELECT d.dept_name, COUNT(p.id) AS project_count FROM departments d LEFT JOIN projects p ON d.id = p.dept_id GROUP BY d.dept_name;` | Table with department names and active project counts. |
| *"Delete all inactive users"* | **BLOCKED BY SECURITY GUARDRAIL** | Error: *"Write and delete operations are restricted. IntelliDB supports read-only queries."* |

---

## 🗺️ Roadmap

- [x] Natural language to ANSI SQL generation with Gemini API
- [x] PostgreSQL & MySQL dynamic schema introspection
- [x] Read-only execution safety guardrails & SQL injection defense
- [ ] Automated chart generation (Bar/Pie charts) for query results
- [ ] Export query results to Excel/PDF reports
- [ ] Support for MongoDB / NoSQL aggregation pipelines

---

## 👤 Author

**Sripallav Yerram**  
- GitHub: [@sripallav](https://github.com/sripallav)  
- LinkedIn: [yerram-sripallav](https://www.linkedin.com/in/yerram-sripallav/)  
- Email: sripallav85@gmail.com
