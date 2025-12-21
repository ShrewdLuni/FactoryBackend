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

CREATE VIEW batches_api AS 
SELECT
  id, 
  name,
  product_id,
  size,
  progress_status AS "progressStatus",
  updated_at AS "updatedAt",
  created_at AS "createdAt"
FROM batches;

CREATE VIEW batches_with_product_api AS 
SELECT
  b.id,
  b.name,
  b.product_id AS "productId",
  b.assigned_master_id AS "assignedMasterId",
  b.size AS "size",
  b.progress_status AS "progressStatus",
  b.planned_for AS "plannedFor",
  b.updated_at AS "updatedAt",
  b.created_at AS "createdAt",
  p.name AS "productName",
  u.full_name AS "assignedMasterName"
FROM batches b
JOIN products p ON p.id = b.product_id
JOIN users u ON u.id = b.assigned_master_id;
