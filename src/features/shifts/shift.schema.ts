import { z } from "zod";
import { DbId } from "schemas/utils";
import { DeviceSchema } from "features/devices/devices.schema";
import { DepartmentSchema } from "features/departments/department.schema";

const shared = {
  id: DbId,
};

const mapped = {
  startedAt: z.coerce.date(),
  endedAt: z.coerce.date().nullable(),
}

const relations = {
  device: z.object({
    id: DeviceSchema.shape.id,
    name: DeviceSchema.shape.name.nullish(),
    capacity: DeviceSchema.shape.capacity.nullish(),
    department: z.object({
      id: DepartmentSchema.shape.id.nullish(),
      label: DepartmentSchema.shape.label.nullish(),
    }).nullish()
  }),
  worker: z.object({
    id: DbId
  })
};

export const ShiftSchema = z.object({ ...shared, ...mapped, ...relations }).meta({ id: "Shift" });

export const ShiftRowSchema = z.object({
  id: shared.id,
  worker_id: relations.worker.shape.id,
  device_id: relations.device.shape.id,
  device_name: relations.device.shape.name,
  device_capacity: relations.device.shape.capacity,
  device_department_id: DepartmentSchema.shape.id.nullish(),
  device_department_label: DepartmentSchema.shape.label.nullish(),
  started_at: mapped.startedAt,
  ended_at: mapped.endedAt,
});

export const ShiftFromRow = ShiftRowSchema.transform((row) => {
  const { worker_id, device_id, device_name, device_capacity, device_department_id, device_department_label, started_at, ended_at, ...rest } = row;
  return {
    ...rest,
    worker:{
      id: worker_id,
    },     
    device: {
      id: device_id,
      name: device_name,
      capacity: device_capacity,
      department: {
        id: device_department_id,
        label: device_department_label,
      }
    },
    startedAt: started_at,
    endedAt: ended_at,
  };
});

export const ShiftInsertSchema = ShiftSchema.omit({ id: true, startedAt: true, endedAt: true }).meta({ id: "ShiftInsert" });

export const ShiftLookupSchema = z.union([
  z.object({ id: z.number().positive() }),
  z.object({ worker: z.number().positive() }),
  z.object({ device: z.number().positive() }),
]);

export type Shift = z.infer<typeof ShiftSchema>;
export type ShiftRow = z.infer<typeof ShiftRowSchema>;
export type ShiftInsert = z.infer<typeof ShiftInsertSchema>;
export type ShiftLookup = z.infer<typeof ShiftLookupSchema>;

export const ShiftStartSchema = ShiftInsertSchema.meta({ id: "ShiftStart" });

export const ShiftEndSchema = ShiftInsertSchema.partial({ device: true }).meta({ id: "ShiftEnd" });

export type ShiftStart = z.infer<typeof ShiftStartSchema>;
export type ShiftEnd = z.infer<typeof ShiftEndSchema>;
