import { Service } from "abstract/service";
import { DepartmentRepository } from "./department.repository";
import type { Department, DepartmentRow, DepartmentLookup, DepartmentInsert} from "./department.schema";

export class DepartmentService extends Service<Department, DepartmentInsert, DepartmentLookup, DepartmentRepository> {
  constructor(repo: DepartmentRepository = new DepartmentRepository()){
    super(repo)
  }
}
