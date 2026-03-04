import { z } from "zod";
import { DbId } from "./utils";

const shared = {
  id: DbId,
  label: z.string(),
};

const mapped = {
  canOverrideWorkflow: z.boolean().default(false),
  isActive: z.boolean().default(true),
};

export const RoleSchema = z.object({ ...shared, ...mapped });

export const RoleRowSchema = z.object({
  ...shared,
  is_active: mapped.isActive,
  can_override_workflow: mapped.canOverrideWorkflow,
});

export const RoleInsertSchema = RoleSchema.omit({ id: true }).partial({ isActive: true, canOverrideWorkflow: true });

export const RoleFromRow = RoleRowSchema.transform((row) => {
  const { is_active, can_override_workflow, ...rest } = row;
  return {
    ...rest,
    isActive: is_active,
    canOverrideWorkflow: can_override_workflow,
  };
});

export type Role = z.infer<typeof RoleSchema>;
export type RoleRow = z.infer<typeof RoleRowSchema>;
export type RoleInsert = z.infer<typeof RoleInsertSchema>;
