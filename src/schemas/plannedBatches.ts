import { z } from "zod";

export const PlannedBatchSchema = z.object({
  id: z.number(),
  productId: z.number().nullish(),
  size: z.number().positive().default(100),
  masters: z.object({
    knitting: z.number().positive().nullish(),
    sewing: z.number().positive().nullish(),
    molding: z.number().positive().nullish(),
    labeling: z.number().positive().nullish(),
    packaging: z.number().positive().nullish(),
  }),
  workstationId: z.number().positive().nullish(),
})

export const DatabasePlannedBatchSchema = z.object({
  id: z.number(),
  product_id: z.number().nullish(),
  size: z.number().positive().default(100),
  knitting_worker_id: z.number().positive().nullish(),
  sewing_worker_id: z.number().positive().nullish(),
  molding_worker_id: z.number().positive().nullish(),
  labeling_worker_id: z.number().positive().nullish(),
  packaging_worker_id: z.number().positive().nullish(),
  workstation_id: z.number().positive().nullish(),
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
