import { z } from "zod";
import { DbId } from "schemas/utils";
import { MeasureUnitSchema } from "features/measureUnits/measureUnit.schema";

const shared = {
  id: DbId,
  code: z.string(),
  name: z.string(),
};

const mapped = {
  isActive: z.boolean().default(true),
};

const relations = {
  measureUnit: z.object({
    id: MeasureUnitSchema.shape.id,
    label: MeasureUnitSchema.shape.label.nullish(),
    isActive: MeasureUnitSchema.shape.isActive.nullish(),
  })
}

export const ProductSchema = z.object({ ...shared, ...mapped, ...relations });

export const ProductRowSchema = z.object({
  ...shared,
  measure_unit_id: relations.measureUnit.shape.id,
  measure_unit_label: relations.measureUnit.shape.label,
  measure_unit_is_active: relations.measureUnit.shape.isActive,
  is_active: mapped.isActive,
});

export const ProductFromRow = ProductRowSchema.transform((db) => {
  const { is_active, measure_unit_id, measure_unit_label, measure_unit_is_active, ...rest } = db;
  return {
    ...rest,
    measureUnit: {
      id: measure_unit_id,
      label: measure_unit_label,
      isActive: measure_unit_is_active,
    },
    isActive: db.is_active,
  };
});

export const ProductInsertSchema = ProductSchema.omit({ id: true }).partial({ isActive: true });

export const ProductLookupSchema = z.union([
  z.object({ id: z.number().positive() }),
  z.object({ code: z.string() })
])

export type Product = z.infer<typeof ProductSchema>;
export type ProductRow = z.infer<typeof ProductRowSchema>;
export type ProductInsert = z.infer<typeof ProductInsertSchema>;
export type ProductLookup = z.infer<typeof ProductLookupSchema>;
