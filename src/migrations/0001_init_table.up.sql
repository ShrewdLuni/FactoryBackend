CREATE TYPE gender as ENUM ('Male', 'Female', 'Other');

CREATE TYPE role as ENUM ('Superuser', 'Manager', 'Worker', 'Observer');

CREATE TYPE batch_progress as ENUM ('Not started', 'In progress', 'Completed');

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  code INTEGER UNIQUE,
  username TEXT UNIQUE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  patronymic TEXT,
  full_name TEXT GENERATED ALWAYS AS (
    first_name || ' ' || last_name ||
      CASE WHEN patronymic IS NULL THEN '' ELSE ' ' || patronymic END
  ) STORED,
  date_of_birth DATE,
  email TEXT,
  phone TEXT,
  gender gender,
  department TEXT,
  role role 
);

CREATE TABLE IF NOT EXISTS authentication (
  employee_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  hash TEXT NOT NULL,
  salt TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  code INTEGER UNIQUE NOT NULL,
  category TEXT,
  name TEXT,
  measure_unit TEXT DEFAULT 'Pairs'
  -- quantity INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  progress_status batch_progress NOT NULL DEFAULT 'Not started'
);

