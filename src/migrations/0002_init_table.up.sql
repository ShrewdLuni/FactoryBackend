CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  auth authentication NOT NULL
);

--
-- CREATE TABLE batch IF NOT EXISTS (
--   id SERAIL PRIMARY KEY,
--   batch_code TEXT NOT NULL,
--   product_code TEXT NOT NULL,
-- );
--
-- CREATE TABLE products IF NOT EXISTS (
--   id SERIAL PRIMARY KEY,
--   category TEXT,
--   name TEXT,
--   product_code TEXT,
--   measure_unit TEXT,
--   quantity TEXT,
-- )
