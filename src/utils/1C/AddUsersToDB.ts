import data from "data/users.json"
import { type DatabaseUser, type InsertUser, UsersFromExternalSchema  } from "schemas/users";
import { query } from "db";

export const AddUsersToDB = async (): Promise<DatabaseUser[]> => {
  const users: InsertUser[] = UsersFromExternalSchema.parse(data.Users);

  const seen = new Set<string>();
  const uniqueUsers = users.filter((u) => {
    if (!u.code) return false;
    if (seen.has(u.code)) return false;
    seen.add(u.code);
    return true;
  });

  if (!uniqueUsers.length) return [];

  const columns = [
    "guid",
    "code",
    "code_drfo",
    "username",
    "first_name",
    "last_name",
    "patronymic",
    "date_of_birth",
    "email",
    "phone",
    "gender",
    "department",
  ];

  const values: any[] = [];
  const placeholders = uniqueUsers.map((u, i) => {
    const offset = i * columns.length;
    values.push(
      u.guid,
      u.code,
      u.taxCode,
      u.username,
      u.firstName,
      u.lastName,
      u.patronymic,
      u.dateOfBirth,
      u.email,
      u.phone,
      u.gender,
      u.department
    );
    return `(${columns.map((_, j) => `$${offset + j + 1}`).join(",")})`;
  });

  const sql = `INSERT INTO users (${columns.join(",")}) VALUES ${placeholders.join(
    ","
  )} RETURNING *`;

  const result = await query(sql, values);
  return result.rows as DatabaseUser[];
};
