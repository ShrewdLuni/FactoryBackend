CREATE TYPE gender as ENUM ('Male', 'Female', 'Other'); 
CREATE TYPE role as ENUM ('Superuser', 'Master', 'Manager', 'Worker', 'Observer'); 
CREATE TYPE batch_progress as ENUM (
'Inactive', 
'Knitting Workshop',
'Sewing Workshop',
'Molding Workshop',
'Labeling Workshop', 
'Packaging Workshop', 
'Completed'
); 

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  guid TEXT UNIQUE,
  code TEXT UNIQUE, 
  code_drfo TEXT UNIQUE,
  username TEXT UNIQUE, 
  first_name TEXT NOT NULL, 
  last_name TEXT NOT NULL, 
  patronymic TEXT DEFAULT NULL, 
  full_name TEXT GENERATED ALWAYS AS (
    last_name || ' ' || first_name || 
      CASE WHEN patronymic IS NULL THEN '' ELSE ' ' || patronymic END
  ) STORED, 
  date_of_birth DATE DEFAULT NULL, 
  email TEXT DEFAULT NULL, 
  phone TEXT DEFAULT NULL, 
  gender gender NOT NULL DEFAULT 'Other', 
  department TEXT DEFAULT NULL, 
  role role NOT NULL DEFAULT 'Worker'
); 

CREATE TABLE IF NOT EXISTS authentication (
  employee_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, 
  hash TEXT NOT NULL, 
  salt TEXT NOT NULL
); 

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY, 
  code TEXT UNIQUE NOT NULL, 
  category TEXT DEFAULT NULL, 
  name TEXT DEFAULT NULL, 
  is_active BOOLEAN DEFAULT TRUE, 
  measure_unit TEXT DEFAULT 'Pairs'
); 

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY, 
  name TEXT, 
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, 
  size INTEGER NOT NULL DEFAULT 100, 
  progress_status batch_progress NOT NULL DEFAULT 'Inactive', 
  planned_for date NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
); 

CREATE TABLE IF NOT EXISTS qr_codes (
  id SERIAL PRIMARY KEY,
  name TEXT,
  resource TEXT,
  is_taken BOOLEAN GENERATED ALWAYS AS (resource IS NOT NULL) STORED
);

CREATE TABLE IF NOT EXISTS workstations (
  id SERIAL PRIMARY KEY,
  name TEXT,
  qr_code INTEGER NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS plans (
  id SERIAL PRIMARY KEY,
  workstation_id INTEGER NOT NULL REFERENCES workstations(id) ON DELETE CASCADE,
  worker_one_id INTEGER REFERENCES users(id) ON DELETE CASCADE DEFAULT NULL,
  worker_two_id INTEGER REFERENCES users(id) ON DELETE CASCADE DEFAULT NULL,
  worker_three_id INTEGER REFERENCES users(id) ON DELETE CASCADE DEFAULT NULL,
  worker_four_id INTEGER REFERENCES users(id) ON DELETE CASCADE DEFAULT NULL,
  worker_five_id INTEGER REFERENCES users(id) ON DELETE CASCADE DEFAULT NULL,
  batch_id INTEGER REFERENCES batches(id) ON DELETE CASCADE DEFAULT NULL,
)

-- Functions
CREATE OR REPLACE FUNCTION set_batch_name() 
RETURNS TRIGGER AS $$ 
BEGIN 
  IF NEW.name IS NULL OR NEW.name = '' THEN 
    NEW.name := 'Batch-' || NEW.id; 
  END IF; 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

CREATE OR REPLACE FUNCTION update_updated_at() 
RETURNS TRIGGER AS $$ 
BEGIN 
  NEW.updated_at := NOW(); 
  RETURN NEW; 
END; 
$$ LANGUAGE plpgsql; 

-- Triggers
CREATE TRIGGER batches_set_name 
BEFORE INSERT ON batches 
FOR EACH ROW 
EXECUTE FUNCTION set_batch_name(); 

CREATE TRIGGER set_updated_at 
BEFORE UPDATE ON batches 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at();

CREATE OR REPLACE FUNCTION advance_batch_progress(batch_id INTEGER)
RETURNS TABLE (
  id INTEGER,
  name TEXT,
  product_id INTEGER,
  assigned_master_id INTEGER,
  size INTEGER,
  progress_status batch_progress,
  planned_for DATE,
  updated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ
) AS $$
DECLARE
  current_status batch_progress;
  new_status batch_progress;
BEGIN
  SELECT b.progress_status INTO current_status
  FROM batches b
  WHERE b.id = batch_id;
  
  IF current_status IS NULL THEN
    RAISE EXCEPTION 'Batch with id % not found', batch_id;
  END IF;
  
  new_status := CASE current_status
    WHEN 'Inactive' THEN 'Knitting Workshop'
    WHEN 'Knitting Workshop' THEN 'Sewing Workshop'
    WHEN 'Sewing Workshop' THEN 'Molding Workshop'
    WHEN 'Molding Workshop' THEN 'Labeling Workshop'
    WHEN 'Labeling Workshop' THEN 'Packaging Workshop'
    WHEN 'Packaging Workshop' THEN 'Completed'
    ELSE current_status
  END;
  
  RETURN QUERY
  UPDATE batches
  SET progress_status = new_status
  WHERE batches.id = batch_id
  RETURNING batches.*;
END;
$$ LANGUAGE plpgsql;
