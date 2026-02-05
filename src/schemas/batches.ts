import { z } from "zod"; 
import { DbId } from "./utils";

const progressEnum = z.enum([
  'Inactive', 
  'Knitting Workshop',
  'Sewing Workshop',
  'Molding Workshop',
  'Labeling Workshop', 
  'Packaging Workshop', 
  'Completed'
])

export const BatchSchema = z.object({ 
  id: DbId,
  name: z.string().optional(), 
  size: z.int().positive().default(100),
  productId: DbId,
  masters: z.object({
    knitting: DbId,
    sewing: DbId,
    molding: DbId,
    labeling: DbId,
    packaging: DbId,
  }),
  workstationId: DbId,
  progressStatus: progressEnum,
  plannedFor: z.coerce.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()), 
  createdAt: z.date().default(() => new Date()), 
}); 

export const DatabaseBatchSchema = z.object({
  id: DbId,
  name: z.string().nullish(),
  product_id: DbId,
  size: z.int().default(100),
  knitting_worker_id: DbId,
  sewing_worker_id: DbId,
  molding_worker_id: DbId,
  labeling_worker_id: DbId,
  packaging_worker_id: DbId,
  workstation_id: DbId,
  progress_status: progressEnum,
  planned_for: z.coerce.date().default(() => new Date()),
  updated_at: z.coerce.date().default(() => new Date()),
  created_at: z.coerce.date().default(() => new Date()),
})

export const DatabaseBatchWithProduct = DatabaseBatchSchema.extend({
  code: z.string(),
  category: z.string().nullish(),
  name: z.string().nullish(),
  is_active: z.boolean().default(true),
  measure_unit: z.string().nullish().default("Pairs"),
})

export const BatchFromDatabase = DatabaseBatchSchema.transform((db) => ({
  id: db.id,
  name: db.name,
  size: db.size,
  productId: db.product_id,
  masters: z.object({
    knitting: db.knitting_worker_id,
    sewing: db.sewing_worker_id,
    molding: db.molding_worker_id,
    labeling: db.labeling_worker_id,
    packaging: db.packaging_worker_id,
  }),
  workstationId: db.workstation_id,
  progressStatus: db.progress_status,
  plannedFor: db.planned_for,
  updatedAt: db.updated_at,
  createdAt: db.created_at,
}))

export const DatabaseFromBatch = BatchSchema.transform((batch) => ({
  id: batch.id,
  name: batch.name,
  product_id: batch.productId,
  size: batch.size,
  knitting_worker_id: batch.masters.knitting,
  sewing_worker_id: batch.masters.sewing,
  molding_worker_id: batch.masters.molding,
  labeling_worker_id: batch.masters.labeling,
  packaging_worker_id: batch.masters.packaging,
  workstation_id: batch.workstationId,
  progress_status: batch.progressStatus,
  planned_for: batch.plannedFor,
  updated_at: batch.updatedAt,
  created_at: batch.createdAt,
}))

export const DatabaseFromBatches = DatabaseFromBatch.array();
export const BatchesFromDatabase = BatchFromDatabase.array();

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
export type DatabaseBatch = z.infer<typeof DatabaseBatchSchema>
export type DatabaseBatchWithProduct = z.infer<typeof DatabaseBatchWithProduct>
export type InsertBatch = z.infer<typeof InsertBatchSchema>;
export type InitializeBatch = z.infer<typeof InitializeBatchSchema>;
