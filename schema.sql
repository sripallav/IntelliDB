-- ========================================================
-- IntelliDB Sample Company Database Schema (PostgreSQL)
-- ========================================================

-- 1. Departments Table
CREATE TABLE IF NOT EXISTS departments (
    id SERIAL PRIMARY KEY,
    dept_name VARCHAR(100) NOT NULL UNIQUE,
    location VARCHAR(100) NOT NULL,
    budget NUMERIC(12, 2) NOT NULL
);

-- 2. Employees Table
CREATE TABLE IF NOT EXISTS employees (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(100) NOT NULL,
    salary NUMERIC(10, 2) NOT NULL,
    department_id INT REFERENCES departments(id) ON DELETE SET NULL,
    hire_date DATE DEFAULT CURRENT_DATE
);

-- 3. Projects Table
CREATE TABLE IF NOT EXISTS projects (
    id SERIAL PRIMARY KEY,
    project_name VARCHAR(150) NOT NULL,
    department_id INT REFERENCES departments(id),
    status VARCHAR(50) DEFAULT 'In Progress',
    deadline DATE
);

-- Sample Seed Data
INSERT INTO departments (dept_name, location, budget) VALUES
('Engineering', 'Hyderabad', 5000000.00),
('Marketing', 'Bangalore', 1500000.00),
('Sales', 'Mumbai', 2500000.00),
('Human Resources', 'Hyderabad', 800000.00)
ON CONFLICT DO NOTHING;

INSERT INTO employees (name, email, role, salary, department_id, hire_date) VALUES
('Sripallav Yerram', 'pallav@company.com', 'Full Stack Engineer', 95000.00, 1, '2023-06-01'),
('Vinod Kumar', 'vinod@company.com', 'Senior Backend Architect', 120000.00, 1, '2022-03-15'),
('Ananya Sharma', 'ananya@company.com', 'Product Designer', 85000.00, 1, '2023-01-10'),
('Rahul Verma', 'rahul@company.com', 'Marketing Lead', 75000.00, 2, '2022-08-20'),
('Priya Patel', 'priya@company.com', 'HR Specialist', 60000.00, 4, '2023-09-05'),
('Karthik Reddy', 'karthik@company.com', 'Sales Manager', 90000.00, 3, '2021-11-12')
ON CONFLICT DO NOTHING;

INSERT INTO projects (project_name, department_id, status, deadline) VALUES
('MarketMind ERP Expansion', 1, 'In Progress', '2026-12-31'),
('IntelliDB AI Migration', 1, 'Completed', '2026-10-15'),
('Q4 Digital Marketing Blitz', 2, 'In Progress', '2026-12-15')
ON CONFLICT DO NOTHING;
