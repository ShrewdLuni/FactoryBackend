import { z } from "zod"
import { DbId } from "./utils";

export const QRCodeSchema = z.object({
  id: DbId,
  isTaken: z.boolean().default(false),
  name: z.string().optional(),
  resource: z.string().nullish(),
});

export const DatabaseQRCodeSchema = z.object({
  id: DbId,
  is_taken: z.boolean().default(false),
  name: z.string().nullish(),
  resource: z.string().nullish(),
})

export const QRCodeFromDatabase = DatabaseQRCodeSchema.transform((db) => ({
  id: db.id,
  isTaken: db.is_taken,
  name: db.name,
  resource: db.resource,
}));

export const DatabaseFromQRCode = QRCodeFromDatabase.transform((qr) => ({
  id: qr.id,
  is_taken: qr.isTaken,
  name: qr.name,
  resource: qr.resource,
}))

export const InsertQRCodeSchema = QRCodeSchema.omit({ id: true, isTaken: true })

export const InitializeQRCodeSchema = InsertQRCodeSchema 
  .extend({amount: z.int().positive(),})
  .transform(({ amount, ...qrcode }) => ({ qrcode, amount }));

export const QRCodesFromDatabase = QRCodeFromDatabase.array()
export const DatabaseFromQRCodes = DatabaseFromQRCode.array()

export type InsertQRCode = z.infer<typeof InsertQRCodeSchema>;

export type QRCode = z.infer<typeof QRCodeSchema>;
export type DatabaseQRCode = z.infer<typeof DatabaseQRCodeSchema>;

