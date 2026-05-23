import { Controller } from "abstract/controller";
import { DefectInsertSchema, type Defect, type DefectInsert } from "./defect.schema";
import { DefectService } from "./defect.service";

export class DefectController extends Controller<Defect, DefectInsert, DefectService> {
  constructor(service: DefectService = new DefectService()) {
    super(service, DefectInsertSchema);
  }
}
