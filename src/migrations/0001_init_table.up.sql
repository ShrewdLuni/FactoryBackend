CREATE TYPE gender as ENUM ('Male', 'Female', 'Other');

CREATE TYPE batch_progress as ENUM ('Not started', 'In progress', 'Completed');

CREATE TABLE IF NOT EXISTS employee (
  id SERIAL PRIMARY KEY,
  code INTEGER UNIQUE,
  firstname TEXT NOT NULL,
  lastname TEXT NOT NULL,
  patronymic TEXT,
  fullname TEXT GENERATED ALWAYS AS (CONCAT(firstname, ' ', lastname, ' ', patronymic)) STORED,
  date_of_birth DATE,
  email TEXT,
  phone TEXT,
  gender gender,
  department TEXT
);

CREATE TABLE IF NOT EXISTS employee_auth (
  employee_id INTEGER PRIMARY KEY REFERENCES employee(id) ON DELETE CASCADE,
  password TEXT NOT NULL,
  salt TEXT NOT NULL,
  session_token TEXT
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  code INTEGER UNIQUE NOT NULL,
  category TEXT,
  name TEXT,
  measure_unit TEXT,
  quantity INTEGER
);

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  progress_status batch_progress NOT NULL DEFAULT 'Not started'
);

