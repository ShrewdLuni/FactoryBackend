CREATE TYPE gender as ENUM ('Male', 'Female', 'Other'); 
CREATE TYPE role as ENUM ('Superuser', 'Master', 'Manager', 'Worker', 'Observer'); 
CREATE TYPE batch_progress as ENUM (
'Inactive', 
'Knitting Workshop(Processing)', 
'Knitting Workshop(Finished)', 
'Sewing Workshop(Processing)', 
'Sewing Workshop(Finished)', 
'Molding Workshop(Processing)', 
'Molding Workshop(Finished)', 
'Labeling Workshop(Processing)', 
'Labeling Workshop(Finished)', 
'Packaging Workshop(Processing)', 
'Packaging Workshop(Finished)', 
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
    first_name || ' ' || last_name || 
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
  category TEXT, 
  name TEXT, 
  active BOOLEAN,
  measure_unit TEXT DEFAULT 'Pairs'
); 

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY, 
  name TEXT, 
  product_id INTEGER NOT NULL REFERENCES products(id) ON DELETE CASCADE, 
  assigned_master_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
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
    WHEN 'Inactive' THEN 'Knitting Workshop(Processing)'
    WHEN 'Knitting Workshop(Processing)' THEN 'Knitting Workshop(Finished)'
    WHEN 'Knitting Workshop(Finished)' THEN 'Sewing Workshop(Processing)'
    WHEN 'Sewing Workshop(Processing)' THEN 'Sewing Workshop(Finished)'
    WHEN 'Sewing Workshop(Finished)' THEN 'Molding Workshop(Processing)'
    WHEN 'Molding Workshop(Processing)' THEN 'Molding Workshop(Finished)'
    WHEN 'Molding Workshop(Finished)' THEN 'Labeling Workshop(Processing)'
    WHEN 'Labeling Workshop(Processing)' THEN 'Labeling Workshop(Finished)'
    WHEN 'Labeling Workshop(Finished)' THEN 'Packaging Workshop(Processing)'
    WHEN 'Packaging Workshop(Processing)' THEN 'Packaging Workshop(Finished)'
    WHEN 'Packaging Workshop(Finished)' THEN 'Completed'
    ELSE current_status
  END;
  
  RETURN QUERY
  UPDATE batches
  SET progress_status = new_status
  WHERE batches.id = batch_id
  RETURNING batches.*;
END;
$$ LANGUAGE plpgsql;
