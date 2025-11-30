CREATE VIEW users_api AS
SELECT
  id,
  code,
  username,
  first_name    AS "firstName",
  last_name     AS "lastName",
  patronymic,
  full_name     AS "fullName",
  date_of_birth AS "dateOfBirth",
  email,
  phone,
  gender,
  department,
  role
FROM users;

CREATE VIEW users_with_auth_api AS
SELECT
  u.id,
  u.code,
  u.username,
  u.first_name    AS "firstName",
  u.last_name     AS "lastName",
  u.patronymic,
  u.full_name     AS "fullName",
  u.date_of_birth AS "dateOfBirth",
  u.email,
  u.phone,
  u.gender,
  u.department,
  u.role,
  a.hash,
  a.salt
FROM users u
JOIN authentication a ON a.employee_id = u.id;

CREATE VIEW products_api AS
SELECT
  id,
  code,
  category,
  name,
  measure_unit AS "measureUnit"
FROM products;
