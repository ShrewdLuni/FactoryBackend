import { z } from "zod";
import { DbId } from "schemas/utils";
import { ProductSchema } from "features/products/product.schema";

const shared = {
  id: DbId,
};

const mapped = {
  boxSize: z.int().positive().min(1),
};

const relations = {
  product: z.object({
    id: ProductSchema.shape.id.nullish(),
    name: ProductSchema.shape.name.nullish(),
  }),
}

export const StorageEntrySchema = z.object({ ...shared, ...mapped, ...relations }).meta({ id: "StorageEntry" });

export const StorageEntryRowSchema = z.object({
  ...shared,
  box_size: mapped.boxSize,
  product_id: relations.product.shape.id,
  product_name: relations.product.shape.name
});

export const StorageEntryFromRow = StorageEntryRowSchema.transform((row) => {
  const { box_size, product_id, product_name, ...rest } = row;
  return {
    ...rest,
    boxSize: box_size,
    product: 
    { 
      id: product_id ,
      name: product_name,
    },
  };
});

export const StorageEntryInsertSchema = StorageEntrySchema.omit({ id: true })
  .extend({
    product: StorageEntrySchema.shape.product.omit({ name: true }),
  })
  .meta({ id: "StorageEntryInsert" });

export const StorageEntryLookupSchema = z.union([
  z.object({ id: z.number().positive() })
])

export type StorageEntry = z.infer<typeof StorageEntrySchema>;
export type StorageEntryRow = z.infer<typeof StorageEntryRowSchema>;
export type StorageEntryInsert = z.infer<typeof StorageEntryInsertSchema>;
export type StorageEntryLookup = z.infer<typeof StorageEntryLookupSchema>
