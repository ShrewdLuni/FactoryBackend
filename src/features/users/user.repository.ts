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
