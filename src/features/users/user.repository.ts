import { Repository } from "abstract/repository";
import { UserFromRow, type User, type UserInsert, type UserLookup, type UserRow } from "./user.schema";

export class UserRepository extends Repository<User, UserRow, UserLookup, UserInsert> {
  constructor() {
    super("Users", UserFromRow, {
      firstName: "first_name",
      lastName: "last_name",
      departmentIds: "departments",
      email: "email",
      isActive: "is_active",
      code: "code",
      username: "username",
      patronymic: "patronymic",
      phone: "phone",
      gender: "gender",
      dateOfBirth: "date_of_birth",
      role: { column: "role_id", extract: (d) => d.role.id }
    });
  }
}
