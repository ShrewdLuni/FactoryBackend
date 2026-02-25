CREATE TYPE gender as ENUM ('Male', 'Female', 'Other'); 

CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  label TEXT UNIQUE NOT NULL,
  can_override_workflow BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  label TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY, 
  guid TEXT UNIQUE,
  code TEXT UNIQUE, 
  code_drfo TEXT UNIQUE,
  username TEXT UNIQUE, 
  first_name TEXT NOT NULL, 
  last_name TEXT NOT NULL, 
  patronymic TEXT, 
  full_name TEXT GENERATED ALWAYS AS (
    last_name || ' ' || first_name || 
      CASE WHEN patronymic IS NULL THEN '' ELSE ' ' || patronymic END
  ) STORED, 
  date_of_birth DATE DEFAULT NULL, 
  email TEXT DEFAULT NULL, 
  phone TEXT DEFAULT NULL, 
  gender gender NOT NULL DEFAULT 'Other', 
  role_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT, 
  is_active BOOLEAN NOT NULL DEFAULT TRUE
); 

CREATE TABLE user_departments (
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  PRIMARY KEY (user_id, department_id)
);

CREATE TABLE IF NOT EXISTS auth (
  user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE, 
  hash TEXT NOT NULL, 
  salt TEXT NOT NULL
); 

CREATE TABLE IF NOT EXISTS qr_codes (
  id SERIAL PRIMARY KEY,
  name TEXT,
  resource TEXT DEFAULT NULL,
  is_taken BOOLEAN GENERATED ALWAYS AS (resource IS NOT NULL) STORED,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS workstations (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  qr_code_id INTEGER UNIQUE NOT NULL REFERENCES qr_codes(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS measure_units (
  id SERIAL PRIMARY KEY,
  label TEXT UNIQUE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY, 
  code TEXT UNIQUE NOT NULL, 
  name TEXT NOT NULL, 
  measure_unit_id INT NOT NULL REFERENCES measure_units(id) ON DELETE RESTRICT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
); 

CREATE TABLE batch_statuses (
  id SERIAL PRIMARY KEY,
  label TEXT UNIQUE NOT NULL,
  sort_order INT NOT NULL,
  is_terminal BOOLEAN NOT NULL DEFAULT FALSE,
  allows_defect_reporting BOOLEAN NOT NULL DEFAULT FALSE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE status_transitions (
  id SERIAL PRIMARY KEY,
  from_status_id INT NOT NULL REFERENCES batch_statuses(id),
  to_status_id INT NOT NULL REFERENCES batch_statuses(id),
  required_department_id INT REFERENCES departments(id),
  required_role_id INT REFERENCES roles(id),
  CONSTRAINT chk_one_actor CHECK (
    (required_department_id IS NOT NULL AND required_role_id IS NULL) OR
    (required_department_id IS NULL AND required_role_id IS NOT NULL)
  ),
  UNIQUE (from_status_id)
);

CREATE TABLE IF NOT EXISTS batches (
  id SERIAL PRIMARY KEY, 
  name TEXT, 
  size INTEGER NOT NULL DEFAULT 100, 
  actual_size INTEGER NOT NULL CHECK (actual_size >= 0), 
  product_id INTEGER REFERENCES products(id) ON DELETE RESTRICT, 
  workstation_id INTEGER REFERENCES workstations(id) ON DELETE RESTRICT,
  status_id INT NOT NULL REFERENCES batch_statuses(id),
  planned_for DATE DEFAULT CURRENT_DATE,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(), 
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_actual_lte_size CHECK (actual_size <= size)
); 

CREATE TABLE batch_transitions (
  id SERIAL PRIMARY KEY,
  batch_id INT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  from_status_id INT REFERENCES batch_statuses(id),
  to_status_id INT NOT NULL REFERENCES batch_statuses(id),
  actor_id INT NOT NULL REFERENCES users(id),
  occurred_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE batch_workers (
  id SERIAL PRIMARY KEY,
  batch_id INT NOT NULL REFERENCES batches(id) ON DELETE CASCADE,
  status_id INT NOT NULL REFERENCES batch_statuses(id),
  worker_id INT NOT NULL REFERENCES users(id),
  UNIQUE (batch_id, status_id)
);

CREATE TABLE defect_types (
  id SERIAL PRIMARY KEY,
  label TEXT NOT NULL,
  is_active BOOLEAN DEFAULT FALSE
);

CREATE TABLE defects (
  id SERIAL PRIMARY KEY,
  batch_id INT NOT NULL REFERENCES batches(id),
  batch_status_id INT NOT NULL REFERENCES batch_statuses(id) ON DELETE RESTRICT,
  defect_type_id INT NOT NULL REFERENCES defect_types(id) ON DELETE RESTRICT,
  quantity INT NOT NULL CHECK (quantity > 0)
);

-- FUNCTIONS
CREATE OR REPLACE FUNCTION set_batch_actual_size()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.actual_size IS NULL THEN
    NEW.actual_size := NEW.size;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER batches_set_actual_size
BEFORE INSERT ON batches
FOR EACH ROW
EXECUTE FUNCTION set_batch_actual_size();

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
 
CREATE TRIGGER batches_set_updated_at
BEFORE UPDATE ON batches
FOR EACH ROW
EXECUTE FUNCTION update_updated_at();
 
 
CREATE OR REPLACE FUNCTION scan_batch(p_batch_id INT, p_actor_id INT)
RETURNS batches AS $$
DECLARE
  v_next_status_id INT;
  v_prev_status_id INT;
  v_result         batches;
BEGIN
  SELECT st.to_status_id, b.status_id
  INTO v_next_status_id, v_prev_status_id
  FROM batches b
  JOIN batch_statuses bs ON bs.id = b.status_id
  JOIN status_transitions st ON st.from_status_id = b.status_id
  JOIN users u ON u.id = p_actor_id AND u.is_active = TRUE
  JOIN roles r ON r.id = u.role_id
  WHERE b.id = p_batch_id
    AND b.is_active = TRUE
    AND bs.is_terminal = FALSE
    AND (
      r.can_override_workflow = TRUE
      OR (st.required_department_id IS NOT NULL AND EXISTS (
        SELECT 1 FROM user_departments
        WHERE user_id = p_actor_id AND department_id = st.required_department_id
      ))
      OR (st.required_role_id IS NOT NULL AND u.role_id = st.required_role_id)
    );
 
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Scan rejected for batch % by user %', p_batch_id, p_actor_id;
  END IF;
 
  UPDATE batches
  SET status_id = v_next_status_id
  WHERE id = p_batch_id
  RETURNING * INTO v_result;
 
  INSERT INTO batch_workers (batch_id, status_id, worker_id)
  VALUES (p_batch_id, v_next_status_id, p_actor_id)
  ON CONFLICT (batch_id, status_id) DO NOTHING;
 
  INSERT INTO batch_transitions (batch_id, from_status_id, to_status_id, actor_id)
  VALUES (p_batch_id, v_prev_status_id, v_next_status_id, p_actor_id);
 
  RETURN v_result;
END;
$$ LANGUAGE plpgsql;
