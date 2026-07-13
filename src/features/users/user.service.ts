import { Service } from "abstract/service";
import { UserRepository } from "./user.repository";
import type { User, UserInsert, UserLookup } from "./user.schema";
import { DepartmentRepository } from "features/departments/department.repository";
import { query, transaction } from "db";

export class UserService extends Service<User, UserInsert, UserLookup, UserRepository> {
  private departmentRepository: DepartmentRepository;

  constructor(repo: UserRepository = new UserRepository(), departmentRepository: DepartmentRepository = new DepartmentRepository()){
    super(repo)
    this.departmentRepository =  departmentRepository;
  }

  async patch(id: number, data: Partial<UserInsert>): Promise<User> {
    const result = await transaction(async (client) => {
      const user = await super.patch(id, data)
      if (data.departmentIds !== undefined &&  data.departmentIds !== null) 
        await this.repository.syncDepartments(id, data.departmentIds);
      return user;
    })
    return result;
  }
}
