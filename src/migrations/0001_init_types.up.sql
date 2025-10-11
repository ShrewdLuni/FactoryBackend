CREATE TYPE authentication AS (
  password TEXT,
  salt TEXT,
  session_token TEXT
);
