import { Repository } from "abstract/repository";
import {
  MeasureUnitFromRow,
  type MeasureUnit,
  type MeasureUnitInsert,
  type MeasureUnitLookup,
  type MeasureUnitRow,
} from "./measureUnit.schema";

export class MeasureUnitRepository extends Repository<
  MeasureUnit,
  MeasureUnitRow,
  MeasureUnitLookup,
  MeasureUnitInsert
> {
  constructor() {
    super("measure_units", MeasureUnitFromRow, { label: "label", isActive: "is_active" });
  }
}
