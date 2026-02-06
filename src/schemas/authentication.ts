import { z } from "zod"
import { DbId } from "./utils"

const shared = {
  hash: z.string(),
  salt: z.string(),
}

const mapped = {
  userId: DbId
}

const AuthenticationSchema = z.object({...shared, ...mapped})

const DatabaseAuthenticationSchema = z.object({
  ...shared,
  user_id: mapped.userId,
})

export const DatabaseFromAuthentication = AuthenticationSchema.transform((auth) => {
  const { userId, ...rest } = auth;
  return ({
    ...rest,
    user_id: userId,
  })
})

export const AuthenticationFromDatabase = DatabaseAuthenticationSchema.transform((db) => {
  const { user_id, ...rest } = db;
  return ({
    ...rest,
    userId: user_id,
  })
})

export const InsertAuthenticationSchema = AuthenticationSchema.omit({})

export type Authentication = z.infer<typeof AuthenticationSchema>;
export type DatabaseAuthentication = z.infer<typeof DatabaseAuthenticationSchema>;
export type InsertAuthentication = z.infer<typeof AuthenticationSchema>;
