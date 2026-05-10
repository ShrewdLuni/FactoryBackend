import { Controller } from "abstract/controller";
import { DepartmentInsertSchema, type DepartmentInsert, type Department } from "./department.schema";
import { DepartmentService } from "./department.service";

export class DepartmentController extends Controller<Department, DepartmentInsert, DepartmentService> {
  constructor(service: DepartmentService = new DepartmentService()) {
    super(service, DepartmentInsertSchema);
  }
}

