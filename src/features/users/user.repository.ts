import { Repository } from "abstract/repository";
import { UserFromRow, type User, type UserInsert, type UserLookup, type UserRow } from "./user.schema";
import { query } from "db";

export class UserRepository extends Repository<User, UserRow, UserLookup, UserInsert> {
  constructor() {
    super("Users", UserFromRow, {
      firstName: "first_name",
      lastName: "last_name",
      // departmentIds: "departments",
      email: "email",
      isActive: "is_active",
      code: "code",
      username: "username",
      patronymic: "patronymic",
      phone: "phone",
      gender: "gender",
      dateOfBirth: "date_of_birth",
      role: { column: "role_id", extract: (d) => d.role.id },
    });
  }

  private readonly WITH_ALL_QUERY = `
    SELECT
      u.*,
      r.label                  AS role_label,
      r.is_active              AS role_is_active,
      r.can_override_workflow  AS role_can_override_workflow,
      COALESCE(
        JSON_AGG(
          JSON_BUILD_OBJECT(
            'id',       d.id,
            'label',    d.label,
            'is_active', d.is_active
          )
        ) FILTER (WHERE d.id IS NOT NULL),
        '[]'
      ) AS departments
    FROM users u
    LEFT JOIN roles r             ON r.id = u.role_id
    LEFT JOIN user_departments ud ON ud.user_id = u.id
    LEFT JOIN departments d       ON d.id = ud.department_id`;

  async findMany(): Promise<User[]> {
    const result = await query<UserRow>(`${this.WITH_ALL_QUERY} GROUP BY u.id, r.id`);
    return UserFromRow.array().parse(result.rows);
  }

  async find(by: UserLookup): Promise<User | null> {
    const [field, value] = Object.entries(by)[0] ?? [];
    if (!field || value === undefined) throw new Error("Invalid lookup");

    const result = await query<UserRow>(`${this.WITH_ALL_QUERY} WHERE u.${field} = $1 GROUP BY u.id, r.id LIMIT 1`, [
      value,
    ]);

    if (!result.rows[0]) return null;
    return UserFromRow.parse(result.rows[0]);
  }

  async syncDepartments(id: number, departmentIds: number[]): Promise<void> {
    console.log(departmentIds, "crazy here")
    await query(`DELETE FROM user_departments WHERE user_id = $1`, [id]);
    if (departmentIds.length === 0) return;
    const values = departmentIds.map((_, i) => `($1, $${i + 2})`).join(", ");
    await query(
    `INSERT INTO user_departments (user_id, department_id) VALUES ${values}`,
    [id, ...departmentIds])
  }
}
