import { Service } from "abstract/service";
import { UserRepository } from "./user.repository";
import type { User, UserInsert, UserLookup } from "./user.schema";

export class UserService extends Service<User, UserInsert, UserLookup, UserRepository> {
  constructor(repo: UserRepository = new UserRepository()){
    super(repo)
  }
}
