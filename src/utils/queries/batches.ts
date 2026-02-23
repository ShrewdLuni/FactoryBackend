import type { InsertBatch } from "schemas/batches";

const FIELDS_PER_BATCH = 12;

export const buildBatchInsertQuery = (batch: InsertBatch, amount: number) => {
  const fullBatchesQuantity = Math.floor(amount / batch.size);
  const remainderBatchSize = amount % batch.size;

  const values: any[] = [];
  const placeholders: string[] = [];

  const totalBatches = fullBatchesQuantity + (remainderBatchSize > 0 ? 1 : 0);

  const pushBatch = (size: number, index: number) => {
    const offset = values.length;
    const batchName = totalBatches > 1 ? `${batch.name ?? null}(${index + 1})` : batch.name ?? null;
    values.push(
      batchName,
      size,
      batch.productId,
      batch.masters.knitting,
      batch.masters.sewing,
      batch.masters.turning,
      batch.masters.molding,
      batch.masters.labeling,
      batch.masters.packaging,
      batch.workstationId,
      batch.isPlanned,
      batch.plannedFor,
    );
    const nums = Array.from({ length: FIELDS_PER_BATCH }, (_, i) => `$${offset + i + 1}`).join(', ');
    placeholders.push(`(${nums})`);
  };

  for (let i = 0; i < fullBatchesQuantity; i++) {
    pushBatch(batch.size, i);
  }

  if (remainderBatchSize > 0) {
    pushBatch(remainderBatchSize, fullBatchesQuantity);
  }

  const assignments = placeholders.join(', ');
  return { assignments, values };
};
