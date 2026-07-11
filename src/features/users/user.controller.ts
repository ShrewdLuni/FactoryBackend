import { Controller } from "abstract/controller";
import { UserInsertSchema, UserPatchSchema, type User, type UserInsert } from "./user.schema";
import { UserService } from "./user.service";
import type { ZodType } from "zod";

export class UserController extends Controller<User, UserInsert, UserService> {
  constructor(service: UserService = new UserService()) {
    super(service, UserInsertSchema, UserPatchSchema as ZodType<Partial<UserInsert>>);
  }
}
