import { z } from "zod";
import { DbId } from "./utils";

export const PlannedBatchSchema = z.object({
  id: DbId,
  productId: DbId,
  size: z.int().positive().default(100),
  masters: z.object({
    knitting: DbId.nullish(),
    sewing: DbId.nullish(),
    molding: DbId.nullish(),
    labeling: DbId.nullish(),
    packaging: DbId.nullish(),
  }),
  workstationId: DbId.nullish(),
})

export const DatabasePlannedBatchSchema = z.object({
  id: DbId,
  product_id: DbId.nullish(),
  size: z.int().positive().default(100),
  knitting_worker_id: DbId.nullish(),
  sewing_worker_id: DbId.nullish(),
  molding_worker_id: DbId.nullish(),
  labeling_worker_id: DbId.nullish(),
  packaging_worker_id: DbId.nullish(),
  workstation_id: DbId.nullish(),
})

export const InsertPlannedBatchSchema = PlannedBatchSchema.omit({ id: true })

export const PlannedBatchFromDatabase = DatabasePlannedBatchSchema.transform((db) => ({
  id: db.id,
  productId: db.product_id,
  size: db.size,
  masters: {
    knitting: db.knitting_worker_id,
    sewing: db.sewing_worker_id,
    molding: db.molding_worker_id,
    labeling: db.labeling_worker_id,
    packaging: db.packaging_worker_id,
  },
  workstationId: db.workstation_id
}))

export const DatabaseFromPlannedBatch = PlannedBatchSchema.transform((plannedBatch) => ({
  id: plannedBatch.id,
  product_id: plannedBatch.productId,
  size: plannedBatch.size,
  knitting_worker_id: plannedBatch.masters.knitting,
  sewing_worker_id: plannedBatch.masters.sewing,
  molding_worker_id: plannedBatch.masters.molding,
  labeling_worker_id: plannedBatch.masters.labeling,
  packaging_worker_id: plannedBatch.masters.packaging,
  workstation_id: plannedBatch.workstationId,
}))

export const PlannedBatchesFromDatabase = PlannedBatchFromDatabase.array()
export const DatabaseFromPlannedBatches = DatabaseFromPlannedBatch.array() 

export type PlannedBatch = z.infer<typeof PlannedBatchSchema>
export type DatabasePlannedBatch = z.infer<typeof DatabasePlannedBatchSchema>
export type InsertPlannedBatch = z.infer<typeof InsertPlannedBatchSchema>
