import { z } from "zod";
import { DbId } from "./utils";

const shared = {
  id: DbId,
  label: z.string(),
};

const mapped = {
  isActive: z.boolean().default(true),
};

export const MeasureUnitSchema = z.object({ ...shared, ...mapped });

export const MeasureUnitRowSchema = z.object({
  ...shared,
  is_active: mapped.isActive,
});

export const MeasureUnitInsertSchema = MeasureUnitSchema.omit({ id: true }).partial({ isActive: true });

export const MeasureUnitFromRow = MeasureUnitRowSchema.transform((row) => {
  const { is_active, ...rest } = row;
  return {
    ...rest,
    isActive: is_active,
  };
});

export type MeasureUnit = z.infer<typeof MeasureUnitSchema>;
export type MeasureUnitRow = z.infer<typeof MeasureUnitRowSchema>;
export type MeasureUnitInsert = z.infer<typeof MeasureUnitInsertSchema>;
