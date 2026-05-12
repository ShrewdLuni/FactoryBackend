import { Controller } from "abstract/controller";
import { MeasureUnitInsertSchema, type MeasureUnit, type MeasureUnitInsert } from "./measureUnit.schema";
import { MeasureUnitService } from "./measureUnit.service";

export class MeasureUnitController extends Controller<MeasureUnit, MeasureUnitInsert, MeasureUnitService> {
  constructor(service: MeasureUnitService = new MeasureUnitService()) {
    super(service, MeasureUnitInsertSchema);
  }
}
