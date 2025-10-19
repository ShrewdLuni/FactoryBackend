import { z } from "zod"

const authenticationSchema = z.object({
  hash: z.string().min(8),
  salt: z.string(),
  // sessionToken: z.string().default("null").optional()
})

const insertAuthenticationSchema = authenticationSchema
  .extend({ userId: z.number().int() })

export type Authentication = z.infer<typeof authenticationSchema>;
export type InsertAuthentication = z.infer<typeof insertAuthenticationSchema>;
