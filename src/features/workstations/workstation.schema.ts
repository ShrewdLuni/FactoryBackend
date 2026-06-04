import { z } from "zod";
import { DbId } from "schemas/utils";
import { QRCodeSchema } from "schemas/qrcode";

const shared = {
  id: DbId,
  name: z.string(),
};

const mapped = {
  isActive: z.boolean().nullable().default(true),
};

const relations = {
  qrcode: z.object({
    id: QRCodeSchema.shape.id.nullish(),
    name: QRCodeSchema.shape.name.nullish(),
    resource: QRCodeSchema.shape.resource.nullish(),
    isTaken: QRCodeSchema.shape.isTaken.nullish(),
    isActive: QRCodeSchema.shape.isActive.nullish(),
  }),
};

export const WorkstationSchema = z.object({ ...shared, ...mapped, ...relations }).meta({ id: "Workstation" });

export const WorkstationRowSchema = z.object({
  ...shared,
  qr_code_id: QRCodeSchema.shape.id.nullish(),
  qr_code_name: QRCodeSchema.shape.name.nullish(),
  qr_code_resource: QRCodeSchema.shape.resource.nullish(),
  qr_code_is_taken: QRCodeSchema.shape.isTaken.nullish(),
  qr_code_is_active: QRCodeSchema.shape.isActive.nullish(),
  is_active: mapped.isActive,
});

export const WorkstationFromRow = WorkstationRowSchema.transform((row) => {
  const { qr_code_id, qr_code_name, qr_code_resource, qr_code_is_taken, qr_code_is_active, is_active, ...rest } = row;
  return {
    ...rest,
    qrcode: {
      id: qr_code_id,
      name: qr_code_name ?? undefined,
      resource: qr_code_resource ?? undefined,
      isTaken: qr_code_is_taken ?? undefined,
      isActive: qr_code_is_active ?? undefined,
    },
    isActive: is_active,
  };
});

export const WorkstationInsertSchema = WorkstationSchema.omit({ id: true, qrcode: true }).meta({ id: "WorkstationInsert" });

export const WorkstationLookupSchema = z.union([z.object({ id: z.number().positive() })]);

export type Workstation = z.infer<typeof WorkstationSchema>;
export type WorkstationRow = z.infer<typeof WorkstationRowSchema>;
export type WorkstationInsert = z.infer<typeof WorkstationInsertSchema>;
export type WorkstationLookup = z.infer<typeof WorkstationLookupSchema>;
