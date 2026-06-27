import z from "zod";

export const packRequestSchema = z.object({
  boxSize: z.number().int().positive(),
  quantity: z.number().int().positive(),
}).meta({ id: "PackProduct" });

