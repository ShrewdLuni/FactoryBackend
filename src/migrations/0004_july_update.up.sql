CREATE TABLE batch_templates (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  use_count INT NOT NULL DEFAULT 0
);

CREATE TABLE batch_template_items (
  id SERIAL PRIMARY KEY,
  template_id INT NOT NULL REFERENCES batch_templates(id) ON DELETE CASCADE,
  name TEXT,
  product_id INT REFERENCES products(id) ON DELETE RESTRICT,
  workstation_id INT REFERENCES workstations(id) ON DELETE RESTRICT,
  sort_order INT NOT NULL DEFAULT 0
);

CREATE TABLE media (
  id SERIAL PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  url TEXT NOT NULL,
  mime_type TEXT NOT NULL,
  size_byte INT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE product_media (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  media_id INT NOT NULL REFERENCES media(id) ON DELETE RESTRICT,
  sort_order INT NOT NULL DEFAULT 0,
  UNIQUE (product_id, media_id)
);

CREATE TABLE storage_entries (
  id SERIAL PRIMARY KEY,
  product_id INT NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  box_size INT NOT NULL CHECK (box_size > 0)
);

CREATE TABLE devices (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  department_id INT NOT NULL REFERENCES departments(id) ON DELETE RESTRICT,
  capacity INT NOT NULL DEFAULT 1,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE worker_device_sessions (
  id SERIAL PRIMARY KEY,
  worker_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  device_id INT NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ended_at TIMESTAMPTZ DEFAULT NULL
);

CREATE TABLE batch_transition_coworkers (
  transition_id INT NOT NULL REFERENCES batch_transitions(id) ON DELETE CASCADE,
  worker_id INT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
  PRIMARY KEY (transition_id, worker_id)
);

ALTER TABLE batch_transitions 
ADD COLUMN device_id INT REFERENCES devices(id) ON DELETE SET NULL;

ALTER TABLE batches DROP CONSTRAINT chk_actual_lte_size;

DROP TRIGGER IF EXISTS batches_set_actual_size ON batches;
DROP FUNCTION IF EXISTS set_batch_actual_size;

ALTER TABLE batches DROP COLUMN size;

ALTER TABLE batches RENAME COLUMN actual_size TO size;
ALTER TABLE batches
ALTER COLUMN size DROP NOT NULL;


BEGIN;

ALTER TABLE products
ADD COLUMN quantity INT NOT NULL DEFAULT 0 CHECK (quantity >= 0);

UPDATE products p
SET quantity = ps.quantity
FROM packed_stock ps
WHERE ps.product_id = p.id;

COMMIT;

ALTER TABLE public.batch_statuses
    ADD COLUMN is_in_progress       boolean NOT NULL DEFAULT false,
    ADD COLUMN is_finished          boolean NOT NULL DEFAULT false,
    ADD COLUMN requires_size_input  boolean NOT NULL DEFAULT false,
    ADD COLUMN is_packaging         boolean NOT NULL DEFAULT false,
    ADD COLUMN allows_size_override boolean NOT NULL DEFAULT false,
    ADD COLUMN subtract_defects     boolean NOT NULL DEFAULT true,
    ADD COLUMN department_id        integer REFERENCES public.departments(id),
    ADD COLUMN is_milestone         boolean NOT NULL DEFAULT false;

UPDATE public.batch_statuses AS t
SET
    label                 = v.label_ua,
    is_active             = v.is_active,
    is_in_progress        = v.is_in_progress,
    is_finished           = v.is_finished,
    requires_size_input   = v.requires_size_input,
    is_packaging          = v.is_packaging,
    allows_size_override  = v.allows_size_override,
    subtract_defects      = v.subtract_defects,
    department_id         = v.department_id,
    is_milestone          = v.is_milestone
FROM (
    VALUES
    -- id, label_en,                              label_ua,                                           progr,  fi, rsize_in, is_packaging, allows_size_override, subtract_defects, department_id, is_milestone
    (1,  'Inactive',                               'Неактивна',                                true,  false, false, false, false, false, false,  NULL::integer, false),
    (2,  'Activated',                              'Активована',                               true,  false, false, true, false, true, false,  NULL,          false),

    (3,  'Knitting (Waiting for confirmation)',     'В''язальний цех (Очікує підтвердження)',  true,  false, false, false, false, false, false,  1,          true),
    (4,  'Knitting (Confirmed)',                    'В''язальний цех (Підтверджено)',          true,  false, false, false, false, false, true,  NULL,             false),

    (5,  'Sewing (In-Progress)',                    'Зашивальний цех (В процесі)',             true,  true,  false, false, false, false, true,  NULL,          false),
    (6,  'Sewing (Finished)',                       'Зашивальний цех (Завершена)',             true,  false, true,  false, false, false, true,  2,             true),

    (7,  'Turning (In-Progress)',                   'Цех вивертання (В процесі)',              true,  true,  false, false, false, false, true,  NULL,          false),
    (8,  'Turning (Finished)',                      'Цех вивертання (Завершена)',              true,  false, true,  false, false, false, true,  3,             true),

    (9,  'Molding (In-Progress)',                   'Формувальний цех (В процесі)',            true,  true,  false, false, false, false, true,  NULL,          false),
    (10, 'Molding (Finished)',                      'Формувальний цех (Завершена)',            true,  false, true,  false, false, false, true,  4,             true),

    (11, 'Labeling (In-Progress)',                  'Бірковий цех (В процесі)',                true,  true,  false, false, false, false, true,  NULL,          false),
    (12, 'Labeling (Finished)',                     'Бірковий цех (Завершена)',                true,  false, true,  false, false, false, true,  5,             true),

    (13, 'Packaging (In-Progress)',                 'Пакувальний цех (В процесі)',             true,  true,  false, false, true,  false, true,  NULL,          false),
    (14, 'Completed',                               'Завершена',                               true,  false, true,  false, false, false, true,  6,             true)
                                                                                                                         --pack   --sw
) AS v(
    id, label_en, label_ua, is_active, is_in_progress, is_finished,
    requires_size_input, is_packaging, allows_size_override, subtract_defects,
    department_id, is_milestone
)
WHERE t.id = v.id;

UPDATE departments d
SET label = v.label_ua
FROM (
    VALUES
        (1, 'В''язальний цех'),
        (2, 'Зашивальний цех'),
        (3, 'Цех вивертання'),
        (4, 'Формувальний цех'),
        (5, 'Бірковий цех'),
        (6, 'Пакувальний цех')
) AS v(id, label_ua)
WHERE d.id = v.id;

UPDATE roles
SET label = 'Працівник'
WHERE id = 1;

UPDATE roles
SET label = 'Майстер'
WHERE id = 2;

ALTER TABLE public.defects ADD COLUMN transition_id integer;

UPDATE public.defects d
SET transition_id = bt.id
FROM public.batch_transitions bt
WHERE bt.batch_id = d.batch_id
  AND bt.to_status_id = d.batch_status_id
  AND bt.id = (
    SELECT bt2.id FROM public.batch_transitions bt2
    WHERE bt2.batch_id = d.batch_id AND bt2.to_status_id = d.batch_status_id
    ORDER BY bt2.occurred_at DESC LIMIT 1
  );

ALTER TABLE public.defects ALTER COLUMN transition_id SET NOT NULL;
ALTER TABLE public.defects ADD CONSTRAINT defects_transition_id_fkey
  FOREIGN KEY (transition_id) REFERENCES public.batch_transitions(id);
ALTER TABLE public.defects DROP COLUMN batch_id;
ALTER TABLE public.defects DROP COLUMN batch_status_id;

ALTER TABLE public.batch_transitions
ADD COLUMN IF NOT EXISTS batch_size INT NOT NULL DEFAULT 0 CHECK (batch_size >= 0);

UPDATE public.batch_transitions bt
SET batch_size = b.size
FROM public.batches b
WHERE b.id = bt.batch_id
  AND bt.batch_size IS NULL;

ALTER TABLE workstations DROP COLUMN qr_code_id;
ALTER TABLE public.batches DROP COLUMN planned_for;

DROP TRIGGER IF EXISTS batch_name_trigger ON batches;
DROP TRIGGER IF EXISTS batches_set_name ON batches;

CREATE OR REPLACE FUNCTION set_batch_name()
RETURNS TRIGGER AS $$
BEGIN
    RAISE NOTICE 'id=%, name=%', NEW.id, NEW.name;

    IF NEW.name IS NULL OR NEW.name = '' THEN
        UPDATE batches
        SET name = 'Batch-' || NEW.id
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER batch_name_trigger
AFTER INSERT ON batches
FOR EACH ROW
EXECUTE FUNCTION set_batch_name();

