# IntelliDB — AI-Powered Natural Language to SQL Query Engine

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Google Gemini API](https://img.shields.io/badge/AI%20Engine-Google%20Gemini-8E75C2?logo=google&logoColor=white)](https://ai.google.dev/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express.js-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-336791?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![React](https://img.shields.io/badge/Frontend-React%2018%20%2B%20Vite-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Architecture](https://img.shields.io/badge/Stack-PERN%20%2B%20AI-blue.svg)](https://github.com/sripallav/IntelliDB)

> **IntelliDB** is an intelligent database querying platform built on the **PERN + AI** stack (**P**ostgreSQL, **E**xpress.js, **R**eact.js, **N**ode.js, **AI** Google Gemini). It translates plain English business questions into syntactically accurate, secure, and optimized SQL queries, enabling non-technical stakeholders (HR, Operations, Executives, Managers) to retrieve real-time insights from relational databases without writing a single line of SQL.

---

## 📌 Problem Statement

In most organizations, business managers, HR professionals, and non-technical decision-makers need ad-hoc data answers daily:
- *"Who are our top 5 highest-paid software engineers hired this year?"*
- *"Show me products that are running low in stock across Mumbai warehouses."*

Historically, these stakeholders must submit support tickets or email data analysts and software engineers, creating bottlenecks and delays of hours or days. 

**IntelliDB bridges this gap:** users type their questions in plain conversational language, and IntelliDB automatically infers the database structure, constructs the SQL query, executes it safely, and presents clean, interactive tabular results in seconds.

---

## 🚀 Key Features

- **Natural Language to SQL (NL-to-SQL)**: Translates human language into standard ANSI SQL for PostgreSQL using the Google Gemini API.
- **Dynamic Schema Introspection**: Reads catalog metadata (`information_schema.tables`, `columns`, data types, foreign keys) at runtime so prompts always match the actual schema.
- **Enterprise Security & Zero Data Leakage**:
  - **No sensitive row data is sent to the LLM** — only table schema definitions and column names are shared.
  - **Read-Only Guardrails**: Strictly rejects destructive commands (`DROP`, `DELETE`, `TRUNCATE`, `ALTER`, `UPDATE`, `INSERT`).
  - **SQL Injection Defense**: Sanitizes inputs and validates generated AST queries before execution.
- **Query Explanation & Performance**: Explains *how* and *why* the query works, providing execution time and row counts.
- **Interactive UI**: Responsive React interface with tabular sorting, pagination, and CSV data export.

---

## 🏗️ System Architecture (PERN + AI)

```text
+-----------------------+
|  Business User / HR   |  "Show me top 5 highest salary employees"
+-----------+-----------+
            | (Plain English Query)
            v
+-----------------------+
|   React Frontend UI   |  Interactive Query Console & Results Table (React + Vite)
+-----------+-----------+
            | (REST API Request)
            v
+-------------------------------------------------------+
|             Node.js + Express.js Backend              |
|                                                       |
|  1. Schema Extractor: Reads DB catalog metadata       |
|  2. Prompt Builder: Merges user query + DB schema     |
|  3. Gemini AI Engine: Synthesizes optimized SQL       |
|  4. Security Validator: Verifies READ-ONLY & Safe AST |
|  5. Query Runner: Executes query via 'pg' pool        |
+---------------------------+---------------------------+
            |               |
            | (Safe SQL)    | (LLM Inference)
            v               v
    +---------------+  +---------------------+
    |  PostgreSQL   |  |  Google Gemini API  |
    |   Database    |  +---------------------+
    +---------------+
```

---

## 🛠️ Tech Stack: PERN + AI

| Layer | Component | Description |
|---|---|---|
| **P** | **PostgreSQL** | Relational database holding organization data and schema definitions |
| **E** | **Express.js** | Fast, minimalist backend web framework for Node.js handling REST APIs |
| **R** | **React.js** | Interactive user interface built with React 18, Vite, and modern CSS |
| **N** | **Node.js** | JavaScript runtime environment executing backend business logic |
| **AI**| **Google Gemini** | Generative AI engine (`gemini-1.5-flash` / `gemini-2.0-flash`) for Text-to-SQL translation |

---

## 🔒 Security & Safe Execution Safeguards

To prevent accidental data corruption or malicious attacks, IntelliDB implements multi-tier guardrails:

1. **Strict Read-Only Filter**: A regex and AST parser ensures only `SELECT` statements are permitted. Destructive statements (`DROP`, `DELETE`, `UPDATE`, `INSERT`, `ALTER`, `TRUNCATE`, `GRANT`) trigger an immediate HTTP `403 Forbidden` response.
2. **Metadata-Only AI Context**: The LLM never sees actual customer or business records. Only table definitions (`CREATE TABLE ...`) are supplied in the system prompt.
3. **Execution Timeout**: Enforces a strict 5-second query timeout to prevent runaway queries or recursive joins.

---

## 💻 Getting Started

### Prerequisites
- Node.js (v18.x or later)
- PostgreSQL installed locally or hosted (e.g., Supabase, Neon, AWS RDS)
- Google Gemini API Key ([Get one at Google AI Studio](https://aistudio.google.com/))

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/sripallav/IntelliDB.git
   cd IntelliDB
   ```

2. **Configure Environment Variables:**
   Create an `.env` file in the `server` directory:
   ```properties
   PORT=5000
   GEMINI_API_KEY=your_gemini_api_key_here

   # PostgreSQL Connection
   PG_HOST=localhost
   PG_PORT=5432
   PG_DATABASE=company_db
   PG_USER=postgres
   PG_PASSWORD=your_password
   ```

3. **Run Backend Service (Node.js + Express):**
   ```bash
   cd server
   npm install
   npm run dev
   ```

4. **Run Frontend Application (React + Vite):**
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

## 👤 Author

**Sripallav Yerram**  
- GitHub: [@sripallav](https://github.com/sripallav)  
- LinkedIn: [yerram-sripallav](https://www.linkedin.com/in/yerram-sripallav/)  
- Email: sripallav85@gmail.com
