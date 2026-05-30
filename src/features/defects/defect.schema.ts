import z from "zod";
import { DbId } from "schemas/utils";
import { DefectTypeSchema } from "features/defectTypes/defectType.schema";
import { BatchStatusSchema } from "features/batchStatuses/batchStatus.schema";

const shared = {
  id: DbId,
  quantity: z.int().positive(),
};

const relations = {
  batch: z.object({
    id: DbId,
  }),
  batchStatus: z.object({
    id: DbId,
    label: BatchStatusSchema.shape.label.nullish(),
    sortOrder: BatchStatusSchema.shape.sortOrder.nullish(),
    isTerminal: BatchStatusSchema.shape.isTerminal.nullish(),
    allowsDefectReporting: BatchStatusSchema.shape.allowsDefectReporting.nullish(),
    isActive: BatchStatusSchema.shape.isActive.nullish(),
    isInProgress: BatchStatusSchema.shape.isInProgress.nullish(),
    isFinished: BatchStatusSchema.shape.isFinished.nullish(),
    requiresSizeInput: BatchStatusSchema.shape.requiresSizeInput.nullish(),
    isPackaging: BatchStatusSchema.shape.isPackaging.nullish(),
  }),
  defectType: z.object({
    id: DefectTypeSchema.shape.id,
    label: DefectTypeSchema.shape.label.nullish(),
    category: DefectTypeSchema.shape.category.nullish(),
    sortOrder: DefectTypeSchema.shape.sortOrder.nullish(),
    isActive: DefectTypeSchema.shape.isActive.nullish(),
  }),
};

export const DefectSchema = z.object({ ...shared, ...relations });

export const DefectRowSchema = z.object({
  ...shared,
  defect_type_id: relations.defectType.shape.id,
  defect_type_label: relations.defectType.shape.label,
  defect_type_category: relations.defectType.shape.category,
  defect_type_sort_order: relations.defectType.shape.sortOrder,
  defect_type_is_active: relations.defectType.shape.isActive,
  batch_status_id: relations.batchStatus.shape.id,
  batch_status_label: relations.batchStatus.shape.label,
  batch_status_sort_order: relations.batchStatus.shape.sortOrder,
  batch_status_is_terminal: relations.batchStatus.shape.isTerminal,
  batch_status_allows_defect_reporting: relations.batchStatus.shape.allowsDefectReporting,
  batch_status_is_active: relations.batchStatus.shape.isActive,
  batch_status_is_in_progress: relations.batchStatus.shape.isInProgress,
  batch_status_is_finished: relations.batchStatus.shape.isFinished,
  batch_status_requires_size_input: relations.batchStatus.shape.requiresSizeInput,
  batch_status_is_packaging: relations.batchStatus.shape.isPackaging,
  batch_id: relations.batch.shape.id,
});

export const DefectInsertSchema = DefectSchema.omit({ id: true }).meta({ id: "DefectInsert" });

export const DefectFromRow = DefectRowSchema.transform((row) => {
  const { 
    batch_id, 
    defect_type_id,
    defect_type_label,
    defect_type_category,
    defect_type_sort_order,
    defect_type_is_active,
    batch_status_id,
    batch_status_label,
    batch_status_sort_order,
    batch_status_is_terminal,
    batch_status_allows_defect_reporting,
    batch_status_is_active,
    batch_status_is_in_progress,
    batch_status_is_finished,
    batch_status_requires_size_input,
    batch_status_is_packaging,
    ...rest } = row;
  return {
    ...rest,
    batch: {
      id: batch_id,
    },
    batchStatus: {
      id: batch_status_id,
      sortOrder: batch_status_sort_order,
      isTerminal: batch_status_is_terminal,
      allowsDefectReporting: batch_status_allows_defect_reporting,
      isActive: batch_status_is_active,
      isInProgress: batch_status_is_in_progress,
      isFinished: batch_status_is_finished,
      requiresSizeInput: batch_status_requires_size_input,
      isPackaging: batch_status_is_packaging,
    },
    defectType: {
      id: defect_type_id,
      label: defect_type_label,
      category: defect_type_category,
      sortOrder: defect_type_sort_order,
      isActive: defect_type_is_active,
    },
  };
});

export const DefectLookupSchema = z.union([z.object({ id: z.number().positive() })]);

export type Defect = z.infer<typeof DefectSchema>;
export type DefectRow = z.infer<typeof DefectRowSchema>;
export type DefectInsert = z.infer<typeof DefectInsertSchema>;
export type DefectLookup = z.infer<typeof DefectLookupSchema>;
