
import { z } from "zod";
import { DbId } from "./utils";

const shared = {
  id: DbId,
};

const mapped = {
  fromStatusId: DbId,
  toStatusId: DbId,
  requiredDepartmentId: DbId.nullish(),
  requiredRoleId: DbId.nullish(),
};

export const StatusTransitionSchema = z.object({ ...shared, ...mapped });

export const StatusTransitionRowSchema = z.object({
  ...shared,
  from_status_id: mapped.fromStatusId,
  to_status_id: mapped.toStatusId,
  required_department_id: mapped.requiredDepartmentId,
  required_role_id: mapped.requiredRoleId,
});

export const StatusTransitionInsertSchema = StatusTransitionSchema.omit({ id: true });

export const StatusTransitionFromRow = StatusTransitionRowSchema.transform((row) => {
  const { from_status_id, to_status_id, required_department_id, required_role_id, ...rest } = row;
  return {
    ...rest,
    fromStatusId: from_status_id,
    toStatusId: to_status_id,
    requiredDepartmentId: required_department_id,
    requiredRoleId: required_role_id,
  };
});

export type StatusTransition = z.infer<typeof StatusTransitionSchema>;
export type StatusTransitionRow = z.infer<typeof StatusTransitionRowSchema>;
export type StatusTransitionInsert = z.infer<typeof StatusTransitionInsertSchema>;


