import { z } from "zod";

const genderEnum = z.enum(["Male", "Female", "Other"]);
const roleEnum = z.enum([
  "Superuser",
  "Master",
  "Manager",
  "Worker",
  "Observer",
]);

export const UserSchema = z.object({
  id: z.number(),
  guid: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  taxCode: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  firstName: z.string(),
  lastName: z.string(),
  patronymic: z.string().optional().nullable(),
  fullName: z.string(),
  dateOfBirth: z.coerce.date().optional().nullable(),
  email: z.email().optional().nullable(),
  phone: z.string().optional().nullable(),
  gender: genderEnum.optional().nullable().default("Other"),
  department: z.string().optional().nullable(),
  role: roleEnum.optional().nullable(),
});

export const DatabaseUserSchema = z.object({
  id: z.number(),
  guid: z.string().optional().nullable(),
  code: z.string().optional().nullable(),
  code_drfo: z.string().optional().nullable(),
  username: z.string().optional().nullable(),
  first_name: z.string(),
  last_name: z.string(),
  patronymic: z.string().optional().nullable(),
  full_name: z.string(),
  date_of_birth: z.coerce.date().optional().nullable(),
  email: z.email().optional().nullable(),
  phone: z.string().optional().nullable(),
  gender: genderEnum.optional().nullable().default("Other"),
  department: z.string().optional().nullable(),
  role: roleEnum.optional().nullable(),
});

export const DatabaseUserWithAuth = DatabaseUserSchema.extend({
  hash: z.string(),
  salt: z.string()
})

export const UserFromDatabase = DatabaseUserSchema.transform((db) => ({
  id: db.id,
  guid: db.guid,
  code: db.code,
  taxCode: db.code_drfo,
  username: db.username,
  firstName: db.first_name,
  lastName: db.last_name,
  patronymic: db.patronymic,
  fullName: db.full_name,
  dateOfBirth: db.date_of_birth,
  email: db.email,
  phone: db.phone,
  gender: db.gender,
  department: db.department,
  role: db.role,
}));

export const DatabaseFromUserSchema = UserSchema.transform((user) => ({
  id: user.id,
  guid: user.guid,
  code: user.code,
  code_drfo: user.taxCode,
  username: user.username,
  first_name: user.firstName,
  last_name: user.lastName,
  patronymic: user.patronymic,
  full_name: user.fullName,
  date_of_birth: user.dateOfBirth,
  email: user.email,
  phone: user.phone,
  gender: user.gender,
  department: user.department,
  role: user.role,
}));

export const UserWithAuthFromDatabase = DatabaseUserWithAuth.transform((db) => ({
  ...UserFromDatabase.parse(db),
  auth: {
    hash: db.hash,
    salt: db.salt
  }
}))

export const InsertUserSchema = UserSchema.omit({ id: true, fullName: true });

export type User = z.infer<typeof UserSchema>;
export type UserWithAuth = z.infer<typeof UserWithAuthFromDatabase>
export type DatabaseUser = z.infer<typeof DatabaseUserSchema>;
export type DatabaseUserWithAuth = z.infer<typeof DatabaseUserWithAuth>

export const UsersFromDatabase = UserFromDatabase.array();
export const DatabaseFromUsers = DatabaseFromUserSchema.array();

export type InsertUser = z.infer<typeof InsertUserSchema>;

export const RegisterSchema = InsertUserSchema.extend({
  password: z.string().min(8),
}).transform(({ password, ...user }) => ({ user, password }));

export const LoginSchema = z
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
