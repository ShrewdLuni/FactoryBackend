import { z } from "zod";
import type { InsertUser } from "schemas/users";

const emptyToNull = z
  .string()
  .transform((val) => (val.trim() === "" ? null : val));

const dateOrNull = z.string().transform((val) => {
  if (!val || val.trim() === "") return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
});

export const ExternalUserSchema = z.object({
  GUID: emptyToNull,
  Code: emptyToNull,
  Name: emptyToNull,
  BDate: dateOrNull,
  CodeDRFO: emptyToNull,
  LName: emptyToNull.optional().nullable(),
  FName: emptyToNull.optional().nullable(),
  SName: emptyToNull.optional().nullable(),
});

export const UserFromExternalSchema = ExternalUserSchema.transform((u): InsertUser => ({
    guid: u.GUID,
    code: u.Code,
    taxCode: u.CodeDRFO,
    username: null,
    firstName: u.FName ?? "",
    lastName: u.LName ?? "",
    patronymic: u.SName ?? null,
    dateOfBirth: u.BDate,
    email: null,
    phone: null,
    gender: "Other",
    department: null,
    role: "Worker",
  }),
);

export const UsersFromExternalSchema = UserFromExternalSchema.array();


