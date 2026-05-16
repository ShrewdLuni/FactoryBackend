import { Controller } from "abstract/controller";
import { DefectTypeInsertSchema, type DefectType, type DefectTypeInsert } from "./defectType.schema";
import { DefectTypeService } from "./defectType.service";

export class DefectTypeController extends Controller<DefectType, DefectTypeInsert, DefectTypeService> {
  constructor(service: DefectTypeService = new DefectTypeService()) {
    super(service, DefectTypeInsertSchema);
  }
}
