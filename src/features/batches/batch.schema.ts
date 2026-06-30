import { BatchStatusSchema } from "features/batchStatuses/batchStatus.schema";
import { ProductSchema } from "features/products/product.schema";
import { WorkstationSchema } from "features/workstations/workstation.schema";
import { DepartmentSchema } from "features/departments/department.schema";
import { DbId } from "schemas/utils";
import { z } from "zod"; 
import { BatchTransitionSchema } from "features/batchTransitions/batchTransitions.schema";
import { UserSchema } from "schemas/user";

// export const BatchWorkerSchema = z.object({
//   department: z.object({
//     id: DepartmentSchema.shape.id,
//     label: DepartmentSchema.shape.label.nullish(),
//     isActive: DepartmentSchema.shape.isActive.nullish(),
//   }),
//   worker: z.object({
//     id: UserSchema.shape.id,
//     fullName: UserSchema.shape.fullName.nullish(),
//   }),
// });

const CoworkerSchema = z.object({
  id: UserSchema.shape.id,
  fullName: UserSchema.shape.fullName.nullish(),
});

const BatchStatusRelationSchema = z.object({
  id: BatchStatusSchema.shape.id,
  label: BatchStatusSchema.shape.label,
  isTerminal: BatchStatusSchema.shape.isTerminal,
  sortOrder: BatchStatusSchema.shape.sortOrder.nullish(),
  allowsDefectReporting: BatchStatusSchema.shape.allowsDefectReporting,
  isActive: BatchStatusSchema.shape.isActive,
  isInProgress: BatchStatusSchema.shape.isInProgress,
  isFinished: BatchStatusSchema.shape.isFinished,
  requiresSizeInput: BatchStatusSchema.shape.requiresSizeInput,
  isPackaging: BatchStatusSchema.shape.isPackaging,
  subtractDefects: BatchStatusSchema.shape.subtractDefects,
  isMilestone: BatchStatusSchema.shape.isMilestone,
  department: z.object({
    id: DepartmentSchema.shape.id.nullable(),
    label: DepartmentSchema.shape.label.nullish(),
  }),
})

const shared = {
  id: DbId,
  name: z.string().nullish(), 
  size: z.int().min(0),
}

const mapped = {
  isActive: z.boolean().optional().default(true)
}

const relations = {
  product: z.object({
    id: ProductSchema.shape.id.nullish(),
    name: ProductSchema.shape.name.nullish(),
  }),
  workstation: z.object({
    id: WorkstationSchema.shape.id.nullish(),
    name: WorkstationSchema.shape.name.nullish(),
  }),
  status: BatchStatusRelationSchema,
  transitions: z.object({
    id: BatchTransitionSchema.shape.id,
    occuredAt: BatchTransitionSchema.shape.occurredAt,
    device: z.object({ 
      id: BatchTransitionSchema.shape.device.shape.id ,
      name: BatchTransitionSchema.shape.device.shape.name 
    }),
    actor: z.object({ 
      id: BatchTransitionSchema.shape.actor.shape.id,
      fullName: BatchTransitionSchema.shape.actor.shape.fullName
    }),
    fromStatus: BatchStatusRelationSchema,
    toStatus: BatchStatusRelationSchema,
    coworkers: CoworkerSchema.array().default([])
  }).array().default([])
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
  status_is_active: relations.status.shape.isActive,
  status_is_in_progress: relations.status.shape.isInProgress,
  status_is_finished: relations.status.shape.isFinished,
  status_requires_size_input: relations.status.shape.requiresSizeInput,
  status_is_packaging: relations.status.shape.isPackaging,
  status_subtract_defects: relations.status.shape.subtractDefects,
  status_is_milestone: relations.status.shape.isMilestone,
  status_department_id: relations.status.shape.department.shape.id.nullable(),
  status_department_label: relations.status.shape.department.shape.label.nullable(),
  is_active: mapped.isActive,
  transitions: z.object({
    id: BatchTransitionSchema.shape.id,
    occurred_at: BatchTransitionSchema.shape.occurredAt,
    batch_size: BatchTransitionSchema.shape.batch.shape.size,

    device_id: BatchTransitionSchema.shape.device.shape.id,
    device_name: BatchTransitionSchema.shape.device.shape.name,

    actor_id: BatchTransitionSchema.shape.actor.shape.id,
    actor_name: BatchTransitionSchema.shape.actor.shape.fullName,

    from_status_id: relations.status.shape.id,
    from_status_label: relations.status.shape.label,
    from_status_sort_order: relations.status.shape.sortOrder,
    from_status_is_terminal: relations.status.shape.isTerminal,
    from_status_allows_defect_reporting: relations.status.shape.allowsDefectReporting,
    from_status_is_active: relations.status.shape.isActive,
    from_status_is_in_progress: relations.status.shape.isInProgress,
    from_status_is_finished: relations.status.shape.isFinished,
    from_status_requires_size_input: relations.status.shape.requiresSizeInput,
    from_status_is_packaging: relations.status.shape.isPackaging,
    from_status_subtract_defects: relations.status.shape.subtractDefects,
    from_status_is_milestone: relations.status.shape.isMilestone,
    from_status_department_id: relations.status.shape.department.shape.id.nullable(),
    from_status_department_label: relations.status.shape.department.shape.label.nullable(),

    to_status_id: relations.status.shape.id,
    to_status_label: relations.status.shape.label,
    to_status_sort_order: relations.status.shape.sortOrder,
    to_status_is_terminal: relations.status.shape.isTerminal,
    to_status_allows_defect_reporting: relations.status.shape.allowsDefectReporting,
    to_status_is_active: relations.status.shape.isActive,
    to_status_is_in_progress: relations.status.shape.isInProgress,
    to_status_is_finished: relations.status.shape.isFinished,
    to_status_requires_size_input: relations.status.shape.requiresSizeInput,
    to_status_is_packaging: relations.status.shape.isPackaging,
    to_status_subtract_defects: relations.status.shape.subtractDefects,
    to_status_is_milestone: relations.status.shape.isMilestone,
    to_status_department_id: relations.status.shape.department.shape.id.nullable(),
    to_status_department_label: relations.status.shape.department.shape.label.nullable(),

    coworkers: z.object({
      id: UserSchema.shape.id,
      full_name: UserSchema.shape.fullName,
    }).array().default([])
  }).array().default([])
})

export const BatchInsertSchema = BatchSchema.omit({ id: true, transitions: true }).partial({ product: true, workstation: true, status: true, size: true }).meta({ id: "BatchInsert" });

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
    isInProgress: row.status_is_in_progress,
    isFinished: row.status_is_finished,
    requiresSizeInput: row.status_requires_size_input,
    isPackaging: row.status_is_packaging,
    subtractDefects: row.status_subtract_defects,
    isMilestone: row.status_is_milestone,
    department: {
      id: row.status_department_id,
      label: row.status_department_label,
    }
  },
  isActive: row.is_active,
  transitions: row.transitions.map((t) => ({
    id: t.id,
    occuredAt: t.occurred_at,
    device: {
      id: t.device_id,
      name: t.device_name,
    },
    actor: {
      id: t.actor_id,
      fullName: t.actor_name,
    },
    fromStatus: {
      id: t.from_status_id,
      label: t.from_status_label,
      isTerminal: t.from_status_is_terminal,
      allowsDefectReporting: t.from_status_allows_defect_reporting,
      isActive: t.from_status_is_active,
      isInProgress: t.from_status_is_in_progress,
      isFinished: t.from_status_is_finished,
      requiresSizeInput: t.from_status_requires_size_input,
      isPackaging: t.from_status_is_packaging,
      subtractDefects: t.from_status_subtract_defects,
      isMilestone: t.from_status_is_milestone,
      department: {
        id: t.from_status_department_id,
        label: t.from_status_department_label
      }
    },
    toStatus: {
      id: t.to_status_id,
      label: t.to_status_label,
      isTerminal: t.to_status_is_terminal,
      allowsDefectReporting: t.to_status_allows_defect_reporting,
      isActive: t.to_status_is_active,
      isInProgress: t.to_status_is_in_progress,
      isFinished: t.to_status_is_finished,
      requiresSizeInput: t.to_status_requires_size_input,
      isPackaging: t.to_status_is_packaging,
      subtractDefects: t.to_status_subtract_defects,
      isMilestone: t.to_status_is_milestone,
      department: {
        id: t.to_status_department_id,
        label: t.to_status_department_label
      }
    },
    coworkers: t.coworkers.map(c => ({
      id: c.id,
      fullName: c.full_name,
    }))
  }))
}));

export const BatchLookupSchema = z.union([
  z.object({ id: z.number().positive() })
]);

export type Batch = z.infer<typeof BatchSchema>; 
export type BatchRow = z.infer<typeof BatchRowSchema>
export type BatchInsert = z.infer<typeof BatchInsertSchema>
export type BatchLookup = z.infer<typeof BatchLookupSchema>
