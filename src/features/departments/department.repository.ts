import { Repository } from "abstract/repository";
import { type Department, type DepartmentLookup, type DepartmentRow, type DepartmentInsert, DepartmentFromRow } from "./department.schema";

export class DepartmentRepository extends Repository<Department, DepartmentRow, DepartmentLookup, DepartmentInsert> {
  constructor() {
    super("departments", DepartmentFromRow, { label: "label", isActive: "is_active" });
  }
}
