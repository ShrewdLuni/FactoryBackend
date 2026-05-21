import { z } from "zod";
import { DbId } from "schemas/utils";

const shared = {
  id: DbId,
  label: z.string(),
};

const mapped = {
  sortOrder: z.int(),
  isTerminal: z.boolean().default(false),
  allowsDefectReporting: z.boolean().default(false),
  isActive: z.boolean().default(false),
  isInProgress: z.boolean().default(false),
  isFinished: z.boolean().default(false),
  requiresSizeInput: z.boolean().default(false),
  isPackaging: z.boolean().default(false),
};

export const BatchStatusSchema = z.object({ ...shared, ...mapped }).meta({ id: "BatchStatus" });

export const BatchStatusRowSchema = z.object({
  ...shared,
  sort_order: mapped.sortOrder,
  is_terminal: mapped.isTerminal,
  allows_defect_reporting: mapped.allowsDefectReporting,
  is_active: mapped.isActive,
  is_in_progress: mapped.isInProgress,
  is_finished: mapped.isFinished,
  requires_size_input: mapped.requiresSizeInput,
  is_packaging: mapped.isPackaging,
});

export const BatchStatusFromRow = BatchStatusRowSchema.transform((row) => {
  const {
    sort_order,
    is_terminal,
    allows_defect_reporting,
    is_active,
    is_in_progress,
    is_finished,
    requires_size_input,
    is_packaging,
    ...rest
  } = row;
  return {
    ...rest,
    sortOrder: sort_order,
    isTerminal: is_terminal,
    allowsDefectReporting: allows_defect_reporting,
    isActive: is_active,
    isInProgress: is_in_progress,
    isFinished: is_finished,
    requiresSizeInput: requires_size_input,
    isPackaging: is_packaging,
  };
});

export const BatchStatusInsertSchema = BatchStatusSchema.omit({ id: true }).partial({ isActive: true });

export const BatchStatusLookupSchema = z.union([z.object({ id: z.number().positive() })]);

export type BatchStatus = z.infer<typeof BatchStatusSchema>;
export type BatchStatusRow = z.infer<typeof BatchStatusRowSchema>;
export type BatchStatusInsert = z.infer<typeof BatchStatusInsertSchema>;
export type BatchStatusLookup = z.infer<typeof BatchStatusLookupSchema>;
