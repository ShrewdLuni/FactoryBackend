import type { InsertBatch } from "schemas/batches";

export const buildBatchInsertQuery = (batch: InsertBatch, amount: number) => {
  const fullBatchesQuantity = Math.floor(amount / batch.size);
  const remainderBatchSize = amount % batch.size;

  const values: any[] = [];
  const placeholders: string[] = [];

  const totalBatches = fullBatchesQuantity + (remainderBatchSize > 0 ? 1 : 0);

  for (let i = 0; i < fullBatchesQuantity; i++) {
    const offset = i * 5;
    const batchName = totalBatches > 1 ? `${batch.name ?? null}(${i + 1})` : batch.name ?? null;
    values.push(batchName, batch.size, batch.productId, batch.assignedMasterId, batch.plannedFor);
    placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
  }

  if (remainderBatchSize > 0) {
    const offset = fullBatchesQuantity * 5;
    const batchName = totalBatches > 1 ? `${batch.name ?? null}(${fullBatchesQuantity + 1})` : batch.name ?? null;
    values.push(batchName, remainderBatchSize, batch.productId, batch.assignedMasterId, batch.plannedFor);
    placeholders.push(`($${offset + 1}, $${offset + 2}, $${offset + 3}, $${offset + 4}, $${offset + 5})`);
  }
 
  const assignments = placeholders.join(', ');
  return { assignments, values };
}
