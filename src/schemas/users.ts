import { z } from "zod"

export const userSchema = z.object({
  id: z.number().int(),
  code: z.number().int().optional(),
  username: z.string().optional(),
  firstName: z.string(),
  lastName: z.string(),
  patronymic: z.string().optional(),
  fullName: z.string(),
  dateOfBirth: z.coerce.date().optional(),
  email: z.email().optional(),
  phone: z.string().optional(),
  gender: z.enum(["Male", "Female", "Other"]).optional(), 
  department: z.string().optional(), 
  role: z.enum(["Superuser", "Manager", "Worker", "Observer"]).optional(),
});

export const insertUserSchema = userSchema.omit({ id: true, fullName: true })

export type User = z.infer<typeof userSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;

export const registerSchema = insertUserSchema
  .extend({ password: z.string().min(8) })
  .transform(({ password, ...user }) => ({ user, password }));

export const loginSchema = insertUserSchema
  .pick({ code: true, username: true })
  .extend({ password: z.string().min(8) })
  .transform(({ password, ...user}) => ({ user, password }))
