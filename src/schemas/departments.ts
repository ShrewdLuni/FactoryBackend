
import { z } from "zod";
import { DbId } from "./utils";

const shared = {
  id: DbId,
  label: z.string(),
};

const mapped = {
  isActive: z.boolean().default(false),
};

export const DepartmentSchema = z.object({ ...shared, ...mapped });

export const DepartmentRowSchema = z.object({
  ...shared,
  is_active: mapped.isActive,
});

export const DepartmentInsertSchema = DepartmentSchema.omit({ id: true }).partial({ isActive: true });

export const DepartmentFromRow = DepartmentRowSchema.transform((row) => {
  const { is_active, ...rest } = row;
  return {
    ...rest,
    isActive: is_active,
  };
});

export type Department = z.infer<typeof DepartmentSchema>;
export type DepartmentRow = z.infer<typeof DepartmentRowSchema>;
export type DepartmentInsert = z.infer<typeof DepartmentInsertSchema>;
