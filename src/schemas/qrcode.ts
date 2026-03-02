import { z } from "zod";
import { DbId } from "./utils";

const shared = {
  id: DbId,
  name: z.string().nullish(),
  resource: z.string().nullish(),
};

const mapped = {
  isTaken: z.boolean().default(false),
  isActive: z.boolean().default(true),
};

export const QRCodeSchema = z.object({ ...shared, ...mapped });

export const DatabaseQRCodeSchema = z.object({
  ...shared,
  is_taken: mapped.isTaken,
  is_active: mapped.isActive,
});

export const QRCodeFromDatabase = DatabaseQRCodeSchema.transform((db) => {
  const { is_taken, is_active, ...rest } = db;
  return {
    ...rest,
    isTaken: db.is_taken,
    isActive: db.is_active,
  };
});

export const DatabaseFromQRCode = QRCodeFromDatabase.transform((qr) => {
  const { isTaken, isActive, ...rest } = qr;
  return {
    ...rest,
    is_taken: qr.isTaken,
    is_active: qr.isActive,
  };
});

export const InsertQRCodeSchema = QRCodeSchema.omit({ id: true, isTaken: true });

export const InitializeQRCodeSchema = InsertQRCodeSchema
.extend({ amount: z.int().positive() })
.transform(({ amount, ...qrcode }) => ({
    qrcode,
    amount,
  }),
);

export const QRCodesFromDatabase = QRCodeFromDatabase.array();
export const DatabaseFromQRCodes = DatabaseFromQRCode.array();

export type InsertQRCode = z.infer<typeof InsertQRCodeSchema>;
export type QRCode = z.infer<typeof QRCodeSchema>;
export type DatabaseQRCode = z.infer<typeof DatabaseQRCodeSchema>;
