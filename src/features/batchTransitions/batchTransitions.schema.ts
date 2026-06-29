import { z } from "zod";
import { DbId } from "schemas/utils";
import { DeviceSchema } from "features/devices/devices.schema";
import { UserSchema } from "features/users/user.schema";
import { BatchStatusSchema } from "features/batchStatuses/batchStatus.schema";
import { DepartmentSchema } from "features/departments/department.schema";

const BatchStatusRelationSchema = z.object({
  id: BatchStatusSchema.shape.id,
  label: BatchStatusSchema.shape.label,
  isTerminal: BatchStatusSchema.shape.isTerminal,
  sortOrder: BatchStatusSchema.shape.sortOrder,
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

const CoworkerSchema = z.object({
  id: UserSchema.shape.id,
  fullName: UserSchema.shape.fullName.nullish(),
});

const shared = {
  id: DbId,
};

const mapped = {
  occurredAt: z.coerce.date().default(() => new Date()),
};

const relations = {
  device: z.object({
    id: DeviceSchema.shape.id.nullable(),
    name: DeviceSchema.shape.name.nullable(),
  }),
  batch: z.object({
    id: DbId,
    size: z.number().nullable(),
  }),
  actor: z.object({
    id: UserSchema.shape.id,
    fullName: UserSchema.shape.fullName.nullish(),
  }),
  fromStatus: BatchStatusRelationSchema,
  toStatus: BatchStatusRelationSchema,
  coworkers: z.array(CoworkerSchema).default([]),
}

export const BatchTransitionSchema = z.object({ ...shared, ...mapped, ...relations }).meta({ id: "BatchTransition" });

export const BatchTransitionRowSchema = z.object({
  ...shared,
  occurred_at: mapped.occurredAt,
  batch_id: relations.batch.shape.id,
  batch_size: relations.batch.shape.size,
  actor_id: relations.actor.shape.id,
  actor_name: relations.actor.shape.fullName.nullish(),
  device_id: relations.device.shape.id.nullable(),
  device_name: relations.device.shape.name.nullable(),
  from_status_id: relations.fromStatus.shape.id,
  from_status_label: relations.fromStatus.shape.label,
  from_status_sort_order: relations.fromStatus.shape.sortOrder,
  from_status_is_terminal: relations.fromStatus.shape.isTerminal,
  from_status_allows_defect_reporting: relations.fromStatus.shape.allowsDefectReporting,
  from_status_is_active: relations.fromStatus.shape.isActive,
  from_status_is_in_progress: relations.fromStatus.shape.isInProgress,
  from_status_is_finished: relations.fromStatus.shape.isFinished,
  from_status_requires_size_input: relations.fromStatus.shape.requiresSizeInput,
  from_status_is_packaging: relations.fromStatus.shape.isPackaging,
  from_status_subtract_defects: relations.fromStatus.shape.subtractDefects,
  from_status_is_milestone: relations.fromStatus.shape.isMilestone,
  from_status_department_id: relations.fromStatus.shape.department.shape.id,
  from_status_department_label: relations.fromStatus.shape.department.shape.label,
  to_status_id: relations.toStatus.shape.id,
  to_status_label: relations.toStatus.shape.label,
  to_status_sort_order: relations.toStatus.shape.sortOrder,
  to_status_is_terminal: relations.toStatus.shape.isTerminal,
  to_status_allows_defect_reporting: relations.toStatus.shape.allowsDefectReporting,
  to_status_is_active: relations.toStatus.shape.isActive,
  to_status_is_in_progress: relations.toStatus.shape.isInProgress,
  to_status_is_finished: relations.toStatus.shape.isFinished,
  to_status_requires_size_input: relations.toStatus.shape.requiresSizeInput,
  to_status_is_packaging: relations.toStatus.shape.isPackaging,
  to_status_subtract_defects: relations.toStatus.shape.subtractDefects,
  to_status_is_milestone: relations.toStatus.shape.isMilestone,
  to_status_department_id: relations.toStatus.shape.department.shape.id,
  to_status_department_label: relations.toStatus.shape.department.shape.label,
  coworkers: z.object({
    id: UserSchema.shape.id,
    full_name: UserSchema.shape.fullName,
  }).array().default([])
});

export const BatchTransitionFromRow = BatchTransitionRowSchema.transform((row): BatchTransition => ({
  id: row.id,
  occurredAt: row.occurred_at,
  batch: {
    id: row.batch_id,
    size: row.batch_size,
  },
  actor: {
    id: row.actor_id,
    fullName: row.actor_name,
  },
  device: {
    id: row.device_id,
    name: row.device_name,
  },
  fromStatus: {
    id: row.from_status_id,
    label: row.from_status_label,
    sortOrder: row.from_status_sort_order,
    isTerminal: row.from_status_is_terminal,
    allowsDefectReporting: row.from_status_allows_defect_reporting,
    isActive: row.from_status_is_active,
    isInProgress: row.from_status_is_in_progress,
    isFinished: row.from_status_is_finished,
    requiresSizeInput: row.from_status_requires_size_input,
    isPackaging: row.from_status_is_packaging,
    subtractDefects: row.from_status_subtract_defects,
    isMilestone: row.from_status_is_milestone,
    department: {
      id: row.from_status_department_id,
      label: row.from_status_department_label
    }
  },
  toStatus: {
    id: row.to_status_id,
    label: row.to_status_label,
    sortOrder: row.to_status_sort_order,
    isTerminal: row.to_status_is_terminal,
    allowsDefectReporting: row.to_status_allows_defect_reporting,
    isActive: row.to_status_is_active,
    isInProgress: row.to_status_is_in_progress,
    isFinished: row.to_status_is_finished,
    requiresSizeInput: row.to_status_requires_size_input,
    isPackaging: row.to_status_is_packaging,
    subtractDefects: row.to_status_subtract_defects,
    isMilestone: row.to_status_is_milestone,
    department: {
      id: row.to_status_department_id,
      label: row.to_status_department_label
    }
  },
  coworkers: row.coworkers.map(c => ({
    id: c.id,
    fullName: c.full_name,
  }))
}));

export const BatchTransitionInsertSchema = z.object({
  batch: z.object({ id: DbId, size: DbId }),
  actor: z.object({ id: DbId }),
  device: z.object({ id: DbId }),
  fromStatus: z.object({ id: DbId }),
  toStatus: z.object({ id: DbId }),
  coworkers: z.array(z.object({ id: DbId })).optional(),
}).meta({ id: "BatchTransitionInsert" });

export const BatchTransitionLookupSchema = z.union([z.object({ id: z.number().positive() })]);

export type BatchTransition = z.infer<typeof BatchTransitionSchema>;
export type BatchTransitionRow = z.infer<typeof BatchTransitionRowSchema>;
export type BatchTransitionInsert = z.infer<typeof BatchTransitionInsertSchema>;
export type BatchTransitionLookup = z.infer<typeof BatchTransitionLookupSchema>;
