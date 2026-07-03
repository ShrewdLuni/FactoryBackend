import z from "zod";
import { DbId } from "schemas/utils";
import { DefectTypeSchema } from "features/defectTypes/defectType.schema";

const shared = {
  id: DbId,
  quantity: z.int().positive(),
};

const relations = {
  transition: z.object({
    id: DbId,
  }),
  defectType: z.object({
    id: DefectTypeSchema.shape.id,
    label: DefectTypeSchema.shape.label.nullish(),
    category: DefectTypeSchema.shape.category.nullish(),
    sortOrder: DefectTypeSchema.shape.sortOrder.nullish(),
    isActive: DefectTypeSchema.shape.isActive.nullish(),
  }),
};

export const DefectSchema = z.object({ ...shared, ...relations }).meta({ id: "Defect" });

export const DefectRowSchema = z.object({
  ...shared,
  defect_type_id: relations.defectType.shape.id,
  defect_type_label: relations.defectType.shape.label,
  defect_type_category: relations.defectType.shape.category,
  defect_type_sort_order: relations.defectType.shape.sortOrder,
  defect_type_is_active: relations.defectType.shape.isActive,
  transition_id: relations.transition.shape.id,
});

export const DefectInsertSchema = DefectSchema.omit({ id: true }).meta({ id: "DefectInsert" });

export const DefectFromRow = DefectRowSchema.transform((row) => {
  const {
    transition_id,
    defect_type_id,
    defect_type_label,
    defect_type_category,
    defect_type_sort_order,
    defect_type_is_active,
    ...rest
  } = row;
  return {
    ...rest,
    transition: {
      id: transition_id,
    },
    defectType: {
      id: defect_type_id,
      label: defect_type_label,
      category: defect_type_category,
      sortOrder: defect_type_sort_order,
      isActive: defect_type_is_active,
    },
  };
});

export const DefectLookupSchema = z.union([z.object({ id: z.number().positive() })]);

export type Defect = z.infer<typeof DefectSchema>;
export type DefectRow = z.infer<typeof DefectRowSchema>;
export type DefectInsert = z.infer<typeof DefectInsertSchema>;
export type DefectLookup = z.infer<typeof DefectLookupSchema>;
