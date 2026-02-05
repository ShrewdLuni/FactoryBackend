import { z } from "zod";
import type { InsertProduct } from "schemas/products";
import { emptyToNull } from "schemas/utils";

export const ExternalProductSchema = z.object({
  code: z.string(),
  name: emptyToNull,
});

export const ProductFromExternalSchema = ExternalProductSchema.transform((product): InsertProduct => ({
  code: product.code,
  category: null,
  name: product.name,
  measureUnit: "Pairs",
  isActive: true
}));

export const ProductsFromExternalSchema = ExternalProductSchema.array();
export type ExternalProduct = z.infer<typeof ExternalProductSchema>;
