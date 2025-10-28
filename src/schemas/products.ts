import { z } from "zod"

export const productSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  category: z.string().optional(),
  name: z.string().optional(),
  measureUnit: z.string().optional().default("Pairs"),
});

export const insertProductSchema = productSchema.omit({ id: true, batchCode: true })

export type Product = z.infer<typeof productSchema>;
export type InsertProduct = z.infer<typeof insertProductSchema>;
