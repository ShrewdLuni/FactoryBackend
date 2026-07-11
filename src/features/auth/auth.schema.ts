import { z } from "zod";
import { UserInsertSchema, UserSchema } from "features/users/user.schema";

const shared = {
  hash: z.string(),
  salt: z.string(),
};

const relations = {
  user: z.object({
    id: UserSchema.shape.id.nullish(),
  }).nullish(),
};

export const AuthSchema = z.object({ ...shared, ...relations }).meta({ id: "Auth" });;

export const AuthRowSchema = z.object({
  ...shared,
  user_id: UserSchema.shape.id,
});

export const AuthFromRow = AuthRowSchema.transform((row) => {
  const { user_id, ...rest } = row;
  return {
    user: {
      id: user_id,
    },
    ...rest,
  };
});

export const AuthInsertSchema = AuthSchema;

export const AuthLookupSchema = z.union([
  z.object({ userId: z.number().positive() }),
]);

export type Auth = z.infer<typeof AuthSchema>;
export type AuthRow = z.infer<typeof AuthRowSchema>;
export type AuthInsert = z.infer<typeof AuthSchema>;
export type AuthLookup = z.infer<typeof AuthLookupSchema>;

export const AuthRegisterSchema = UserInsertSchema.extend({
  password: z.string().min(8),
}).transform(({ password, ...user }) => ({ user, password }));

export const AuthLoginSchema = z
  .union([
    z.object({
      code: z.string(),
      password: z.string().min(8),
    }),
    z.object({
      username: z.string(),
      password: z.string().min(8),
    }),
  ])
  .transform((data) => ({
    user: {
      code: "code" in data ? data.code : undefined,
      username: "username" in data ? data.username : undefined,
    },
    password: data.password,
  }));

export type AuthRegister = z.infer<typeof AuthRegisterSchema>;
export type AuthLogin = z.infer<typeof AuthLoginSchema>;
