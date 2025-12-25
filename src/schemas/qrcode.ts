import { z } from "zod"

export const qrcodeSchema = z.object({
  id: z.number().int(),
  isTaken: z.boolean().default(false),
  name: z.string().optional(),
  resource: z.string().optional(),
});

export const insertQRCodeSchema = qrcodeSchema.omit({ id: true, isTaken: true })

export const initializeQRCodeSchema = insertQRCodeSchema
  .extend({amount: z.number().int(),})
  .transform(({ amount, ...qrcode }) => ({ qrcode, amount }));

export type QRCode = z.infer<typeof qrcodeSchema>;
export type InsertQRCode = z.infer<typeof insertQRCodeSchema>;
