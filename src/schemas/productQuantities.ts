import { z } from "zod";
import { BatchStatusSchema } from "features/batchStatuses/batchStatus.schema";
import { ProductSchema } from "features/products/product.schema";
import { MeasureUnitSchema } from "features/measureUnits/measureUnit.schema";


const relations = {
  status: z.object({
    id: BatchStatusSchema.shape.id,
    label: BatchStatusSchema.shape.label,
    sortOrder: BatchStatusSchema.shape.sortOrder,
    isTerminal: BatchStatusSchema.shape.isTerminal,
    allowsDefectReporting: BatchStatusSchema.shape.allowsDefectReporting,
    isInProgress: BatchStatusSchema.shape.isInProgress,
    isFinished: BatchStatusSchema.shape.isFinished,
    requiresSizeInput: BatchStatusSchema.shape.requiresSizeInput,
    isPackaging: BatchStatusSchema.shape.isPackaging,
  }),
  products: z.array(
    z.object({
      id: ProductSchema.shape.id,
      name: ProductSchema.shape.name,
      measureUnit: z.object({
        id: MeasureUnitSchema.shape.id,
      }),
      quantity: z.number(),
      batchCount: z.number(),
    }),
  ),
};

export const QuantitiesByStatusSchema = z.object({
  status: relations.status,
  products: relations.products,
}).meta({ id: "QuantitiesByStatus" });

export const QuantitiesByStatusRowSchema = z.object({
  status_id: relations.status.shape.id,
  status_label: relations.status.shape.label,
  status_sort_order: relations.status.shape.sortOrder,
  status_is_terminal: relations.status.shape.isTerminal,
  status_allows_defect_reporting: relations.status.shape.allowsDefectReporting,
  status_is_in_progress: relations.status.shape.isInProgress,
  status_is_finished: relations.status.shape.isFinished,
  status_requires_size_input: relations.status.shape.requiresSizeInput,
  status_is_packaging: relations.status.shape.isPackaging,
  products: relations.products,
});

export const QuantitiesByStatusFromRow = QuantitiesByStatusRowSchema.transform((row) => ({
  status: {
    id: row.status_id,
    label: row.status_label,
    sortOrder: row.status_sort_order,
    isTerminal: row.status_is_terminal,
    allowsDefectReporting: row.status_allows_defect_reporting,
    isInProgress: row.status_is_in_progress,
    isFinished: row.status_is_finished,
    requiresSizeInput: row.status_requires_size_input,
    isPackaging: row.status_is_packaging,
  },
  products: row.products,
}));

export type QuantitiesByStatusRow = z.infer<typeof QuantitiesByStatusRowSchema>;
export type QuantitiesByStatus = z.infer<typeof QuantitiesByStatusFromRow>;
