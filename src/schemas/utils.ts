import { z } from "zod";

export const emptyToNull = z
  .string()
  .transform((val) => (val.trim() === "" ? null : val));

export const dateOrNull = z.string().transform((val) => {
  if (!val || val.trim() === "") return null;
  const d = new Date(val);
  return isNaN(d.getTime()) ? null : d;
});

export const DbId = z.int().positive()

