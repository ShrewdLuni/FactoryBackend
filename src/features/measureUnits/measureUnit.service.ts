import { Service } from "abstract/service";
import { MeasureUnitRepository } from "./measureUnit.repository";
import type { MeasureUnit, MeasureUnitInsert, MeasureUnitLookup } from "./measureUnit.schema";

export class MeasureUnitService extends Service<MeasureUnit, MeasureUnitInsert, MeasureUnitLookup, MeasureUnitRepository> {
  constructor(repo: MeasureUnitRepository = new MeasureUnitRepository()) {
    super(repo);
  }
}
