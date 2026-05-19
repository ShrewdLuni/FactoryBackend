import { z } from "zod";
import { DbId } from "schemas/utils";
import { DepartmentSchema } from "features/departments/department.schema";

const shared = {
  id: DbId,
  name: z.string(),
  capacity: z.int().positive().default(1),
};

const mapped = {
  isActive: z.boolean().default(true),
};

const relations = {
  department: z.object({
    id: DepartmentSchema.shape.id,
    label: DepartmentSchema.shape.label.nullish(),
    isActive: DepartmentSchema.shape.isActive.nullish(),
  })
}

export const DeviceSchema = z.object({ ...shared, ...mapped, ...relations });

export const DeviceRowSchema = z.object({
  ...shared,
  is_active: mapped.isActive,
  department_id: relations.department.shape.id,
  department_label: relations.department.shape.label,
  department_is_active: relations.department.shape.isActive,
});

export const DeviceFromRow = DeviceRowSchema.transform((row) => {
  const { is_active, department_id, department_label, department_is_active, ...rest } = row;
  return {
    ...rest,
    isActive: is_active,
    department: {
      id: department_id,
      label: department_label,
      isActive: department_is_active,
    },
  };
});

export const DeviceInsertSchema = DeviceSchema.omit({ id: true }).partial({ isActive: true, capacity: true });

export const DeviceLookupSchema = z.union([
  z.object({ id: z.number().positive() })
])

export type Device = z.infer<typeof DeviceSchema>;
export type DeviceRow = z.infer<typeof DeviceRowSchema>;
export type DeviceInsert = z.infer<typeof DeviceInsertSchema>;
export type DeviceLookup = z.infer<typeof DeviceLookupSchema>
