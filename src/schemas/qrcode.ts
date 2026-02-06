import { z } from "zod"
import { DbId } from "./utils";

const shared = {
  id: DbId,
  name: z.string().optional(),
  resource: z.string().nullish(),
}

const mapped = {
  isTaken: z.boolean().default(false),
}

export const QRCodeSchema = z.object({...shared, ...mapped});

export const DatabaseQRCodeSchema = z.object({
  ...shared,
  is_taken: mapped.isTaken,
})

export const QRCodeFromDatabase = DatabaseQRCodeSchema.transform((db) => {
  const { is_taken, ...rest} = db;
  return {
    ...rest,
    isTaken: db.is_taken,
  }
});

export const DatabaseFromQRCode = QRCodeFromDatabase.transform((qr) => {
  const { isTaken, ...rest} = qr;
  return {
    ...rest,
    is_taken: qr.isTaken,
  }
})

export const InsertQRCodeSchema = QRCodeSchema.omit({ id: true, isTaken: true })

export const InitializeQRCodeSchema = InsertQRCodeSchema 
  .extend({amount: z.int().positive(),})
  .transform(({ amount, ...qrcode }) => ({ qrcode, amount }));

export const QRCodesFromDatabase = QRCodeFromDatabase.array()
export const DatabaseFromQRCodes = DatabaseFromQRCode.array()

export type InsertQRCode = z.infer<typeof InsertQRCodeSchema>;

export type QRCode = z.infer<typeof QRCodeSchema>;
export type DatabaseQRCode = z.infer<typeof DatabaseQRCodeSchema>;
