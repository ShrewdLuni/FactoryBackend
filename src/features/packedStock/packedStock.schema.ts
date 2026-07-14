import { z } from "zod";
import { DbId } from "schemas/utils";
import { ProductSchema } from "features/products/product.schema";

const shared = {
  id: DbId,
  quantity: z.int().positive(),
};

const relations = {
  product: z.object({
    id: ProductSchema.shape.id,
    code: ProductSchema.shape.code.nullish(),
    name: ProductSchema.shape.name.nullish(),
    boxSize: ProductSchema.shape.boxSize.nullish(),
  })
}

export const PackedStockSchema = z.object({ ...shared, ...relations }).meta({ id: "PackedStock" });

export const PackedStockRowSchema = z.object({
  ...shared,
  product_id: relations.product.shape.id,
  product_code: relations.product.shape.code.nullish(),
  product_name: relations.product.shape.name.nullish(),
  product_box_size: relations.product.shape.boxSize.nullish(),
});

export const PackedStockFromRow = PackedStockRowSchema.transform((row) => {
  const { product_id, product_code, product_name, product_box_size, ...rest } = row;
  return {
    ...rest,
    product: {
      id: product_id,
      code: product_code,
      name: product_name,
      boxSize: product_box_size,
    }
  };
});

export const PackedStockInsertSchema = PackedStockSchema.omit({ id: true }).meta({ id:"PackedStockInsert" })

export const PackedStockLookupSchema = z.union([
  z.object({ id: z.number().positive() })
])

export type PackedStock = z.infer<typeof PackedStockSchema>;
export type PackedStockRow = z.infer<typeof PackedStockRowSchema>;
export type PackedStockInsert = z.infer<typeof PackedStockInsertSchema>;
export type PackedStockLookup = z.infer<typeof PackedStockLookupSchema>
