import { z } from "zod"; 

export const batchSchema = z.object({ 
  id: z.number().int(), 
  name: z.string().optional(), 
  productId: z.number().int(), 
  size: z.number().int().default(100), 
  progressStatus: z.enum(["Not started", "In progress", "Completed"]), 
  updatedAt: z.date().default(() => new Date()), 
  createdAt: z.date().default(() => new Date()), 
}); 

export const insertBatchSchema = batchSchema.omit({ 
  id: true, 
  progressStatus: true, 
  updatedAt: true, 
  createdAt: true, 
}); 

export const initializeBatchSchema = insertBatchSchema
  .extend({amount: z.number().int(),})
  .transform(({ amount, ...batch }) => ({ batch, amount }));

export type Batch = z.infer<typeof batchSchema>; 
export type InsertBatch = z.infer<typeof insertBatchSchema>;
export type InitializeBatch = z.infer<typeof initializeBatchSchema>;
