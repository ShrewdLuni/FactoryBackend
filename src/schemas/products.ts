import { z } from "zod"

export const productSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  category: z.string(),
  name: z.string(),
  measureUnit: z.string(),
  quantity: z.number().int(),
});

export const insertProductSchema = productSchema.omit({ id: true, batchCode: true })
