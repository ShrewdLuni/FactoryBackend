import { Repository } from "abstract/repository";
import { AuthFromRow, type Auth, type AuthInsert, type AuthLookup, type AuthRow } from "./auth.schema";

export class AuthRepository extends Repository<Auth, AuthRow, AuthLookup, AuthInsert> {
  constructor() {
    super("authentication", AuthFromRow, { user: { column: "user_id", extract: (d) => d.user.id }, hash: "hash", salt: "salt" })
  }
}
