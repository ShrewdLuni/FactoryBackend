CREATE TYPE gender as ENUM ('Male', 'Female', 'Other'); 
CREATE TYPE role as ENUM ('Superuser', 'Manager', 'Worker', 'Observer'); 
CREATE TYPE batch_progress as ENUM ('Not started', 'In progress', 'Completed'); 

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  code TEXT UNIQUE, 
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
  code TEXT UNIQUE NOT NULL, 
  category TEXT, 
  name TEXT, 
  measure_unit TEXT DEFAULT 'Pairs'
  -- quantity INTEGER DEFAULT 0
); 

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY, 
  name TEXT, 
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, 
  size INTEGER DEFAULT 100, 
  progress_status batch_progress NOT NULL DEFAULT 'Not started', 
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
); 

CREATE OR REPLACE FUNCTION set_batch_name() 
RETURNS TRIGGER AS $$ 
BEGIN 
  IF NEW.name IS NULL OR NEW.name = '' THEN 
    NEW.name := 'Batch-' || NEW.id; 
  END IF; 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

CREATE TRIGGER batches_set_name 
BEFORE INSERT ON batches 
FOR EACH ROW 
EXECUTE FUNCTION set_batch_name(); 

CREATE OR REPLACE FUNCTION update_updated_at() 
RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at := NOW(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

CREATE TRIGGER set_updated_at 
BEFORE UPDATE ON batches 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();

