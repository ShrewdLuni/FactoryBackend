import { Repository } from "abstract/repository";
import { DefectFromRow, type Defect, type DefectInsert, type DefectLookup, type DefectRow } from "./defect.schema";

export class DefectRepository extends Repository<Defect, DefectRow, DefectLookup, DefectInsert> {
  constructor() {
    super("Defects", DefectFromRow, {
      quantity: "quantity",
      batch: { column: "batch_id", extract: (d) => d.batch.id },
      batchStatus: { column: "batch_status_id", extract: (d) => d.batchStatus.id },
      defectType: { column: "defect_type_id", extract: (d) => d.defectType.id }
    });
  }
}
