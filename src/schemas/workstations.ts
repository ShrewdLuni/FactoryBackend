import { z } from "zod"; 
import { DbId } from "./utils";

export const WorkstationSchema = z.object({ 
  id: DbId,
  name: z.string().nullish().default(null), 
  qrCode: DbId.nullish().default(null), 
}); 

export const DatabaseWorkstationSchema = z.object({ 
  id: DbId,
  name: z.string().nullish().default(null), 
  qr_code: DbId.nullish().default(null), 
}); 

export const WokrstationFromDatabase = DatabaseWorkstationSchema.transform((db) => ({
  id: db.id,
  name: db.name,
  qrCode: db.qr_code,
}));

export const DatabaseFromWorkstation = WorkstationSchema.transform((workstation) => ({
  id: workstation.id,
  name: workstation.name,
  qr_code: workstation.qrCode
}))

export const InsertWorkstationSchema = DatabaseWorkstationSchema.omit({ id: true })

export const WorkstationsFromDatabase = WokrstationFromDatabase.array()
export const DatabaseFromWorkstations = DatabaseFromWorkstation.array()

export type Workstation = z.infer<typeof WorkstationSchema>; 
export type DatabaseWorkstation = z.infer<typeof DatabaseWorkstationSchema>; 
export type InsertWorkstation = z.infer<typeof InsertWorkstationSchema>;
