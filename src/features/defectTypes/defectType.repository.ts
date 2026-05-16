import { Repository } from "abstract/repository";
import { DefectTypeFromRow, type DefectType, type DefectTypeInsert, type DefectTypeLookup, type DefectTypeRow } from "./defectType.schema";

export class DefectTypeRepository extends Repository<DefectType, DefectTypeRow, DefectTypeLookup, DefectTypeInsert> {
  constructor() {
    super("DefectTypes", DefectTypeFromRow, { label: "label", category: "category", sortOrder: "sortOrder", isActive: "is_active" })
  }
}
