import z from "zod";
import { DbId } from "schemas/utils";

const defectTypeEnum = z.enum(["second_grade", "spoilage"]);

const shared = {
  id: DbId,
  label: z.string(),
  category: defectTypeEnum.default("second_grade"),
};

const mapped = {
  sortOrder: z.int().positive().default(0),
  isActive: z.boolean().default(true),
};

export const DefectTypeSchema = z.object({ ...shared, ...mapped });

export const DefectTypeRowSchema = z.object({
  ...shared,
  sort_order: mapped.sortOrder,
  is_active: mapped.isActive,
});


export const DefectTypeFromRow = DefectTypeRowSchema.transform((row) => {
  const { is_active, sort_order, ...rest } = row;
  return {
    ...rest,
    sortOrder: sort_order,
    isActive: is_active,
  };
});

export const DefectTypeInsertSchema = DefectTypeSchema.omit({ id: true }).partial({ isActive: true });

export const DefectTypeLookupSchema = z.union([z.object({ id: z.number().positive() })]);

export type DefectType = z.infer<typeof DefectTypeSchema>;
export type DefectTypeRow = z.infer<typeof DefectTypeRowSchema>;
export type DefectTypeInsert = z.infer<typeof DefectTypeInsertSchema>;
export type DefectTypeLookup = z.infer<typeof DefectTypeLookupSchema>;
