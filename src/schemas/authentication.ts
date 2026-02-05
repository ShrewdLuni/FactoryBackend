import { z } from "zod"
import { DbId } from "./utils"

const DatabaseAuthenticationSchema = z.object({
  user_id: DbId,
  hash: z.string(),
  salt: z.string(),
})

const AuthenticationSchema = z.object({
  userId: DbId,
  hash: z.string(),
  salt: z.string(),
})

export const DatabaseFromAuthentication = AuthenticationSchema.transform((auth) => ({
  user_id: auth.userId,
  hash: auth.hash,
  salt: auth.salt,
}))

export const AuthenticationFromDatabase = DatabaseAuthenticationSchema.transform((db) => ({
  userId: db.user_id,
  hash: db.hash,
  salt: db.salt,
}))

export const InsertAuthenticationSchema = AuthenticationSchema.omit({})

export type Authentication = z.infer<typeof AuthenticationSchema>;
export type DatabaseAuthentication = z.infer<typeof DatabaseAuthenticationSchema>;
export type InsertAuthentication = z.infer<typeof AuthenticationSchema>;
