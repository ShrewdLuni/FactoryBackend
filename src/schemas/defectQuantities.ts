import { z } from "zod";
import { DefectTypeSchema } from "features/defectTypes/defectType.schema";
import { ProductSchema } from "features/products/product.schema";

const relations = {
  product: z.object({
    id: ProductSchema.shape.id,
    name: ProductSchema.shape.name,
  }),
  defects: z.array(
    z.object({
      type: z.object({
        id: DefectTypeSchema.shape.id,
        label: DefectTypeSchema.shape.label,
        category: DefectTypeSchema.shape.category,
      }),
      quantity: z.number(),
    }),
  ),
};

export const DefectsByProductSchema = z.object({
  product: relations.product,
  defects: relations.defects,
}).meta({ id: "DefectsByProduct" });

export const DefectsByProductRowSchema = z.object({
  product_id: relations.product.shape.id,
  product_name: relations.product.shape.name,
  defects: relations.defects,
});

export const DefectsByProductFromRow = DefectsByProductRowSchema.transform((row) => ({
  product: {
    id: row.product_id,
    name: row.product_name,
  },
  defects: row.defects,
}));

export type DefectsByProductRow = z.infer<typeof DefectsByProductRowSchema>;
export type DefectsByProduct = z.infer<typeof DefectsByProductFromRow>;
