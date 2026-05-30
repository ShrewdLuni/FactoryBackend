import { BatchStatusSchema } from "features/batchStatuses/batchStatus.schema";
import { ProductSchema } from "features/products/product.schema";
import { WorkstationSchema } from "features/workstations/workstation.schema";
import { DepartmentSchema } from "features/departments/department.schema";
import { DbId } from "schemas/utils";
import { z } from "zod"; 
import { UserSchema } from "features/users/user.schema";

export const BatchWorkerSchema = z.object({
  department: z.object({
    id: DepartmentSchema.shape.id,
    label: DepartmentSchema.shape.label.nullish(),
    isActive: DepartmentSchema.shape.isActive.nullish(),
  }),
  worker: z.object({
    id: UserSchema.shape.id,
    fullName: UserSchema.shape.fullName.nullish(),
  }),
});

const shared = {
  id: DbId,
  name: z.string().nullish(), 
  size: z.int().min(0).nullish(),
}

const mapped = {
  workers: BatchWorkerSchema.array().nullish(),
  isActive: z.boolean().optional().default(true)
}

const relations = {
  product: z.object({
    id: ProductSchema.shape.id.nullish(),
    name: ProductSchema.shape.name.nullish(),
  }),
  workstation: z.object({
    id: WorkstationSchema.shape.id,
    name: WorkstationSchema.shape.name.nullish(),
    isActive: WorkstationSchema.shape.isActive.nullish(),
  }),
  status: z.object({
    id: BatchStatusSchema.shape.id,
    label: BatchStatusSchema.shape.label.nullish(),
    sortOrder: BatchStatusSchema.shape.sortOrder.nullish(),
    isTerminal: BatchStatusSchema.shape.isTerminal.nullish(),
    allowsDefectReporting: BatchStatusSchema.shape.allowsDefectReporting.nullish(),
    isInProgress: BatchStatusSchema.shape.isInProgress.nullish(),
    isFinished: BatchStatusSchema.shape.isFinished.nullish(),
    requiresSizeInput: BatchStatusSchema.shape.requiresSizeInput.nullish(),
    isPackaging: BatchStatusSchema.shape.isPackaging.nullish(),
    isActive: BatchStatusSchema.shape.isActive.nullish(),
  }),
}

export const BatchSchema = z.object({ ...mapped, ...shared, ...relations }).meta({ id: "Batch" }); 

export const BatchRowSchema = z.object({
  ...shared,
  product_id: relations.product.shape.id,
  product_name: relations.product.shape.name,
  workstation_id: relations.workstation.shape.id,
  workstation_name: relations.workstation.shape.name,
  status_id: relations.status.shape.id,
  status_label: relations.status.shape.label,
  status_sort_order: relations.status.shape.sortOrder,
  status_is_terminal: relations.status.shape.isTerminal,
  status_allows_defect_reporting: relations.status.shape.allowsDefectReporting,
  status_is_in_progress: relations.status.shape.isInProgress,
  status_is_finished: relations.status.shape.isFinished,
  status_requires_size_input: relations.status.shape.requiresSizeInput,
  status_is_packaging: relations.status.shape.isPackaging,
  status_is_active: relations.status.shape.isActive,
  workers: BatchWorkerSchema.array().nullish().default([]),
  is_active: mapped.isActive,
})

export const BatchInsertSchema = BatchSchema.omit({ id: true, workers: true }).meta({ id: "BatchInsert" })

export const BatchFromRow = BatchRowSchema.transform((row): Batch => ({
  id: row.id,
  name: row.name,
  size: row.size,
  product: {
    id: row.product_id,
    name: row.product_name,
  },
  workstation: {
    id: row.workstation_id,
    name: row.workstation_name,
  },
  status: {
    id: row.status_id,
    label: row.status_label,
    sortOrder: row.status_sort_order,
    isTerminal: row.status_is_terminal,
    allowsDefectReporting: row.status_allows_defect_reporting,
    isActive: row.status_is_active,
  },
  workers: row.workers,
  isActive: row.is_active,
}));

export const BatchLookupSchema = z.union([
  z.object({ id: z.number().positive() })
]);

export type Batch = z.infer<typeof BatchSchema>; 
export type BatchRow = z.infer<typeof BatchRowSchema>
export type BatchInsert = z.infer<typeof BatchInsertSchema>
export type BatchLookup = z.infer<typeof BatchLookupSchema>
