import { BatchTemplateItemSchema } from "features/batchTemplateItems/batchTemplateItem.schema";
import { DbId } from "schemas/utils";
import { z } from "zod"; 

const TemplateItemsSchema = z.array(BatchTemplateItemSchema.omit({ template: true })).default([])

const shared = {
  id: DbId,
  name: z.string().nullish(), 
  description: z.string().nullish()
}

const mapped = {
  useCount: z.int().positive().default(0)
}

const relations = {
  items: TemplateItemsSchema 
};

export const BatchTemplateSchema = z.object({ ...mapped, ...shared, ...relations }).meta({ id: "BatchTemplate" }); 

export const BatchTemplateRowSchema = z.object({
  ...shared,
  use_count: mapped.useCount,
  items: TemplateItemsSchema,
})

export const BatchTemplateInsertSchema = BatchTemplateSchema.omit({ id: true, items: true }).partial({ useCount: true }).meta({ id: "BatchTemplateInsert" });

export const BatchTemplateFromRow = BatchTemplateRowSchema.transform((row): BatchTemplate => {
  const { use_count, ...rest } = row;
  return {
    ...rest,
    useCount: use_count,
  };
});

export const BatchTemplateLookupSchema = z.union([
  z.object({ id: z.number().positive() })
]);

export type BatchTemplate = z.infer<typeof BatchTemplateSchema>; 
export type BatchTemplateRow = z.infer<typeof BatchTemplateRowSchema>
export type BatchTemplateInsert = z.infer<typeof BatchTemplateInsertSchema>
export type BatchTemplateLookup = z.infer<typeof BatchTemplateLookupSchema>
