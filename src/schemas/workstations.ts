import { z } from "zod"; 
import { DbId } from "./utils";

const shared = { 
  id: DbId,
  name: z.string().nullish().default(null), 
}

const mapped = {
  qrCode: DbId.nullish().default(null), 
}

export const WorkstationSchema = z.object({...shared, ...mapped}); 

export const DatabaseWorkstationSchema = z.object({ 
  ...shared,
  qr_code: mapped.qrCode,
}); 

export const WokrstationFromDatabase = DatabaseWorkstationSchema.transform((db) => {
  const { qr_code, ...rest } = db;
  return { 
    ...rest,
    qrCode: qr_code, 
  }
});

export const DatabaseFromWorkstation = WorkstationSchema.transform((workstation) => {
  const { qrCode, ...rest } = workstation;
  return { 
    ...rest,
    qr_code: qrCode 
  }
})

export const InsertWorkstationSchema = WorkstationSchema.omit({ id: true })

export const WorkstationsFromDatabase = WokrstationFromDatabase.array()
export const DatabaseFromWorkstations = DatabaseFromWorkstation.array()

export type Workstation = z.infer<typeof WorkstationSchema>; 
export type DatabaseWorkstation = z.infer<typeof DatabaseWorkstationSchema>; 
export type InsertWorkstation = z.infer<typeof InsertWorkstationSchema>;
