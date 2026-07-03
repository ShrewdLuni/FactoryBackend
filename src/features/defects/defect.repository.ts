import { Repository } from "abstract/repository";
import { DefectFromRow, type Defect, type DefectInsert, type DefectLookup, type DefectRow } from "./defect.schema";

export class DefectRepository extends Repository<Defect, DefectRow, DefectLookup, DefectInsert> {
  constructor() {
    super("Defects", DefectFromRow, {
      quantity: "quantity",
      defectType: { column: "defect_type_id", extract: (d) => d.defectType.id },
      transition: { column: "transition_id", extract: (d) => d.transition.id }
    });
  }
}
