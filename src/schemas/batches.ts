import { z } from "zod"; 
import { DbId, Timestamps } from "./utils";
import { DatabaseProductSchema, ProductSchema } from "./products";

const progressEnum = z.enum([
  'Inactive', 
  'Knitting Workshop (In-Progress)',
  'Knitting Workshop (Finished)',
  'Sewing Workshop (In-Progress)',
  'Sewing Workshop (Finished)',
  'Turning Workshop (In-Progress)',
  'Turning Workshop (Finished)',
  'Molding Workshop (In-Progress)',
  'Molding Workshop (Finished)',
  'Labeling Workshop (In-Progress)',
  'Labeling Workshop (Finished)',
  'Packaging Workshop (In-Progress)',
  'Packaging Workshop (Finished)',
  'Completed'
])

const shared = {
  id: DbId,
  name: z.string().nullish(), 
  size: z.int().positive().default(100),
}

const mapped = {
  productId: DbId.nullish(),
  workstationId: DbId.nullish(),
  progressStatus: progressEnum,
  actualSize: z.int().positive().nullish(),
  masters: z.object({
    knitting: DbId.nullish(),
    sewing: DbId.nullish(),
    turning: DbId.nullish(),
    molding: DbId.nullish(),
    labeling: DbId.nullish(),
    packaging: DbId.nullish(),
  }),
  isPlanned: z.boolean().nullish().default(false),
  plannedFor: z.coerce.date().default(() => new Date()),
 ...Timestamps
}

export const BatchSchema = z.object({ 
  ...mapped,
  ...shared,
}); 

export const BatchWithProductSchema = BatchSchema.extend({
  product: {...ProductSchema.omit({ id: true })}
})

export const DatabaseBatchSchema = z.object({
  ...shared,
  product_id: mapped.productId,
  actual_size: mapped.actualSize,
  knitting_worker_id: mapped.masters.shape.knitting,
  sewing_worker_id: mapped.masters.shape.sewing,
  turning_worker_id: mapped.masters.shape.turning,
  molding_worker_id: mapped.masters.shape.molding,
  labeling_worker_id: mapped.masters.shape.labeling,
  packaging_worker_id: mapped.masters.shape.packaging,
  workstation_id: mapped.workstationId,
  progress_status: mapped.progressStatus,
  is_planned: mapped.isPlanned,
  planned_for: mapped.plannedFor,
  updated_at: mapped.updatedAt,
  created_at: mapped.createdAt,
})

export const DatabaseBatchWithProductSchema = DatabaseBatchSchema.extend({
  product: {...DatabaseProductSchema.omit({ id: true })}
})

export const BatchFromDatabase = DatabaseBatchSchema.transform((db) => ({
  id: db.id,
  name: db.name,
  size: db.size,
  productId: db.product_id,
  actualSize: db.actual_size,
  masters: {
    knitting: db.knitting_worker_id,
    sewing: db.sewing_worker_id,
    turning: db.turning_worker_id,
    molding: db.molding_worker_id,
    labeling: db.labeling_worker_id,
    packaging: db.packaging_worker_id,
  },
  workstationId: db.workstation_id,
  progressStatus: db.progress_status,
  isPlanned: db.is_planned,
  plannedFor: db.planned_for,
  updatedAt: db.updated_at,
  createdAt: db.created_at,
}))

export const BatchWithProductFromDatabase = DatabaseBatchWithProductSchema.transform((db) => {
  const batch = BatchFromDatabase.parse(db)
  return {
    ...batch,
    product: {
      code: db.product.code,
      category: db.product.category,
      name: db.product.name,
      isActive: db.product.is_active,
      measureUnit: db.product.measure_unit,
    }
  }
})

export const DatabaseFromBatch = BatchSchema.transform((batch) => ({
  id: batch.id,
  name: batch.name,
  product_id: batch.productId,
  size: batch.size,
  actual_size: batch.actualSize,
  knitting_worker_id: batch.masters.knitting,
  sewing_worker_id: batch.masters.sewing,
  turning_worker_id: batch.masters.turning,
  molding_worker_id: batch.masters.molding,
  labeling_worker_id: batch.masters.labeling,
  packaging_worker_id: batch.masters.packaging,
  workstation_id: batch.workstationId,
  progress_status: batch.progressStatus,
  is_planned: batch.isPlanned,
  planned_for: batch.plannedFor,
  updated_at: batch.updatedAt,
  created_at: batch.createdAt,
}))

export const DatabaseFromBatches = DatabaseFromBatch.array();
export const BatchesFromDatabase = BatchFromDatabase.array();
export const BatchesWithProductFromDatabase = BatchWithProductFromDatabase.array();

export const InsertBatchSchema = BatchSchema.omit({ 
  id: true, 
  progressStatus: true, 
  updatedAt: true, 
  createdAt: true, 
}); 

export const InitializeBatchSchema = InsertBatchSchema
  .extend({amount: z.int(),})
  .transform(({ amount, ...batch }) => ({ batch, amount }));

export type Batch = z.infer<typeof BatchSchema>; 
export type BatchWithProduct = z.infer<typeof BatchWithProductSchema>;
export type DatabaseBatch = z.infer<typeof DatabaseBatchSchema>;
export type DatabaseBatchWithProduct = z.infer<typeof DatabaseBatchWithProductSchema>;
export type InsertBatch = z.infer<typeof InsertBatchSchema>;
export type InitializeBatch = z.infer<typeof InitializeBatchSchema>;
