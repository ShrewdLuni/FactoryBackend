import { z } from "zod"; 

export const WorkstationSchema = z.object({ 
  id: z.number().int(), 
  name: z.string().optional().nullable().default(null), 
  qrCode: z.number().int().optional().nullable().default(null), 
}); 

export const DatabaseWorkstationSchema = z.object({ 
  id: z.number().int(), 
  name: z.string().optional().nullable().default(null), 
  qr_code: z.number().int().optional().nullable().default(null), 
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

export const InsertWorkstationSchema = z.preprocess(
  (data: any) => ({
    ...data,
    qr_code: data.qr_code ?? data.qrCode,
  }),
  DatabaseWorkstationSchema.omit({ id: true })
);

export const WorkstationsFromDatabase = WokrstationFromDatabase.array()
export const DatabaseFromWorkstations = DatabaseFromWorkstation.array()

export type Workstation = z.infer<typeof WorkstationSchema>; 
export type DatabaseWorkstation = z.infer<typeof DatabaseWorkstationSchema>; 
export type InsertWorkstation = z.infer<typeof InsertWorkstationSchema>;
