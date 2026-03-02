import { z } from "zod";
import { DbId } from "./utils";

const shared = {
  id: DbId,
  name: z.string(),
};

const mapped = {
  qrCodeId: DbId.nullish(),
  isActive: z.boolean().default(true),
};

export const WorkstationSchema = z.object({ ...shared, ...mapped });

export const DatabaseWorkstationSchema = z.object({
  ...shared,
  qr_code_id: mapped.qrCodeId,
  is_active: mapped.isActive,
});

export const WokrstationFromDatabase = DatabaseWorkstationSchema.transform((db) => {
  const { qr_code_id, is_active, ...rest } = db;
  return {
    ...rest,
    qrCodeId: qr_code_id,
    isActive: is_active,
  };
});

export const DatabaseFromWorkstation = WorkstationSchema.transform((workstation) => {
  const { qrCodeId, isActive, ...rest } = workstation;
  return {
    ...rest,
    qr_code_id: qrCodeId,
    is_active: isActive,
  };
});

export const InsertWorkstationSchema = WorkstationSchema.omit({ id: true });

export const WorkstationsFromDatabase = WokrstationFromDatabase.array();
export const DatabaseFromWorkstations = DatabaseFromWorkstation.array();

export type Workstation = z.infer<typeof WorkstationSchema>;
export type DatabaseWorkstation = z.infer<typeof DatabaseWorkstationSchema>;
export type InsertWorkstation = z.infer<typeof InsertWorkstationSchema>;
