import { z } from "zod"
import { DbId } from "./utils"

const shared = {
  hash: z.string(),
  salt: z.string(),
}

const mapped = {
  userId: DbId
}

export const AuthenticationSchema = z.object({...shared, ...mapped})

export const AuthenticationRowSchema = z.object({
  ...shared,
  user_id: mapped.userId,
})

export const AuthenticationFromRow = AuthenticationRowSchema.transform((row) => {
  const { user_id, ...rest } = row;
  return ({
    userId: user_id,
    ...rest,
  })
})

export const AuthenticationInsertSchema = AuthenticationSchema.omit({})

export type Authentication = z.infer<typeof AuthenticationSchema>;
export type AuthenticationRow = z.infer<typeof AuthenticationRowSchema>;
export type AuthenticationInsert = z.infer<typeof AuthenticationInsertSchema>;
