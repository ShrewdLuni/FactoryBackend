import { z } from "zod"

export const batchSchema = z.object({
  id: z.number().int(),
  code: z.string(),
  productId: z.number().int(),
  progressStatus: z.string(),
})

export const insertBatchSchema = batchSchema.omit({ id: true, batchCode: true })
