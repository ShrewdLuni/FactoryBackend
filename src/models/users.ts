import { z } from "zod"

export const authenticationSchema = z.object({
  password: z.string(),
  salt: z.string(),
  sessionToken: z.string()
})

export const userWithAuthSchema = z.object({
  id: z.number().int(),
  username: z.string(),
  email: z.string().email(),
  authentication: authenticationSchema
});

export const userSchema = userWithAuthSchema.pick({
  id: true,
  username: true,
  email: true,
})

export const insertUserSchema = userSchema.omit({ id: true })

export type User = z.infer<typeof userSchema>;
export type UserWithAuth = z.infer<typeof userWithAuthSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
