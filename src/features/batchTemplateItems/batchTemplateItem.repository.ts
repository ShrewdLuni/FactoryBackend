import { Repository } from "abstract/repository";
import { BatchTemplateItemFromRow, type BatchTemplateItem, type BatchTemplateItemInsert, type BatchTemplateItemLookup, type BatchTemplateItemRow } from "./batchTemplateItem.schema";

export class BatchTemplateItemRepository extends Repository<BatchTemplateItem, BatchTemplateItemRow, BatchTemplateItemLookup, BatchTemplateItemInsert> {
  constructor() {
    super("batch_template_items", BatchTemplateItemFromRow, {
      template: { column: "template_id", extract: (d) => d.template.id },
      name: "name",
      product: { column: "product_id", extract: (d) => d.product ? d.product.id : null },
      workstation: { column: "workstation_id", extract: (d) => d.workstation ? d.workstation.id : null },
      sortOrder: "sort_order",
    });
  }
}
