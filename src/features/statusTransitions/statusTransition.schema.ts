import { z } from "zod";
import { DbId } from "schemas/utils";
import { DepartmentSchema } from "features/departments/department.schema";
import { RoleSchema } from "features/roles/role.schema";
import { BatchStatusSchema } from "features/batchStatuses/batchStatus.schema";

const BatchStatusRelationSchema = z.object({
  id: BatchStatusSchema.shape.id,
  label: BatchStatusSchema.shape.label,
  isTerminal: BatchStatusSchema.shape.isTerminal,
  allowsDefectReporting: BatchStatusSchema.shape.allowsDefectReporting,
  isActive: BatchStatusSchema.shape.isActive,
  isInProgress: BatchStatusSchema.shape.isInProgress,
  isFinished: BatchStatusSchema.shape.isFinished,
  requiresSizeInput: BatchStatusSchema.shape.requiresSizeInput,
  isPackaging: BatchStatusSchema.shape.isPackaging,
  subtractDefects: BatchStatusSchema.shape.subtractDefects,
});

const requiredDepartment = z.object({
  id: DepartmentSchema.shape.id,
  label: DepartmentSchema.shape.label,
}).nullish();

const requiredRole = z.object({
  id: RoleSchema.shape.id,
  label: RoleSchema.shape.label,
}).nullish();

const shared = {
  id: DbId,
};

const relations = {
  fromStatus: BatchStatusRelationSchema,
  toStatus: BatchStatusRelationSchema,
  required: z.object({
    department: requiredDepartment,
    role: requiredRole,
  }).nullish(),
};

const StatusTransitionSchema = z.object({ ...shared, ...relations }).meta({ id: "StatusTransition" })

export const StatusTransitionRowSchema = z.object({
  ...shared,
  from_status_id: BatchStatusSchema.shape.id,
  from_status_label: BatchStatusSchema.shape.label.nullish(),
  from_status_is_terminal: BatchStatusSchema.shape.isTerminal,
  from_status_allows_defect_reporting: BatchStatusSchema.shape.allowsDefectReporting,
  from_status_is_active: BatchStatusSchema.shape.isActive,
  from_status_is_in_progress: BatchStatusSchema.shape.isInProgress,
  from_status_is_finished: BatchStatusSchema.shape.isFinished,
  from_status_requires_size_input: BatchStatusSchema.shape.requiresSizeInput,
  from_status_is_packaging: BatchStatusSchema.shape.isPackaging,
  from_status_subtract_defects: BatchStatusSchema.shape.subtractDefects,
  to_status_id: BatchStatusSchema.shape.id,
  to_status_label: BatchStatusSchema.shape.label.nullish(),
  to_status_is_terminal: BatchStatusSchema.shape.isTerminal,
  to_status_allows_defect_reporting: BatchStatusSchema.shape.allowsDefectReporting,
  to_status_is_active: BatchStatusSchema.shape.isActive,
  to_status_is_in_progress: BatchStatusSchema.shape.isInProgress,
  to_status_is_finished: BatchStatusSchema.shape.isFinished,
  to_status_requires_size_input: BatchStatusSchema.shape.requiresSizeInput,
  to_status_is_packaging: BatchStatusSchema.shape.isPackaging,
  to_status_subtract_defects: BatchStatusSchema.shape.subtractDefects,
  required_department_id: DepartmentSchema.shape.id.nullish(),
  required_department_label: DepartmentSchema.shape.label.nullish(),
  required_role_id: RoleSchema.shape.id.nullish(), 
  required_role_label: RoleSchema.shape.label.nullish(),
});

export const StatusTransitionFromRow = StatusTransitionRowSchema.transform((row) => {
  const {
    from_status_id,
    from_status_label,
    from_status_is_terminal,
    from_status_allows_defect_reporting,
    from_status_is_active,
    from_status_is_in_progress,
    from_status_is_finished,
    from_status_requires_size_input,
    from_status_is_packaging,
    from_status_subtract_defects,
    to_status_id,
    to_status_label,
    to_status_is_terminal,
    to_status_allows_defect_reporting,
    to_status_is_active,
    to_status_is_in_progress,
    to_status_is_finished,
    to_status_requires_size_input,
    to_status_is_packaging,
    to_status_subtract_defects,
    required_department_id,
    required_department_label,
    required_role_id,
    required_role_label,
    ...rest
  } = row;
  return {
    ...rest,
    fromStatus: {
      id: from_status_id, 
      label: from_status_label, 
      isTerminal: from_status_is_terminal, 
      allowsDefectReporting: from_status_allows_defect_reporting, 
      isActive: from_status_is_active, 
      isInProgress: from_status_is_in_progress, 
      isFinished: from_status_is_finished, 
      requiresSizeInput: from_status_requires_size_input, 
      isPackaging: from_status_is_packaging, 
      subtractDefects: from_status_subtract_defects
    },
    toStatus: {
      id: to_status_id, 
      label: to_status_label, 
      isTerminal: to_status_is_terminal, 
      allowsDefectReporting: to_status_allows_defect_reporting, 
      isActive: to_status_is_active, 
      isInProgress: to_status_is_in_progress, 
      isFinished: to_status_is_finished, 
      requiresSizeInput: to_status_requires_size_input, 
      isPackaging: to_status_is_packaging, 
      subtractDefects: to_status_subtract_defects
    },
    required: {
      department: {
        id: required_department_id,
        label: required_department_label,
      },
      role: {
        id: required_role_id,
        label: required_role_label,
      },
    }
  } as StatusTransition;
});

export const StatusTransitionInsertSchema = z.object({
  fromStatus: BatchStatusRelationSchema.pick({ id: true }),
  toStatus: BatchStatusRelationSchema.pick({ id: true }),
  requiredDepartment: requiredDepartment.unwrap().unwrap().pick({ id: true }).nullable(),
  requiredRole: requiredRole.unwrap().unwrap().pick({ id: true }).nullable(),
});


export const StatusTransitionLookupSchema = z.union([
  z.object({ id: z.number().positive() }),
  z.object({ fromStatus: { id: z.number().positive() } }),
  z.object({ toStatus: z.number().positive() }),
]);

export type StatusTransition = z.infer<typeof StatusTransitionSchema>;
export type StatusTransitionRow = z.infer<typeof StatusTransitionRowSchema>;
export type StatusTransitionInsert = z.infer<typeof StatusTransitionInsertSchema>;
export type StatusTransitionLookup = z.infer<typeof StatusTransitionLookupSchema>;
