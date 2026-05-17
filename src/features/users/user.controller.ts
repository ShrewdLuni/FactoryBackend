import { Controller } from "abstract/controller";
import { UserInsertSchema, type User, type UserInsert } from "./user.schema";
import { UserService } from "./user.service";

export class UserController extends Controller<User, UserInsert, UserService> {
  constructor(service: UserService = new UserService()) {
    super(service, UserInsertSchema);
  }
}
