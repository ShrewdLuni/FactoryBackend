import { ProductSchema } from "features/products/product.schema";
import { WorkstationSchema } from "features/workstations/workstation.schema";
import { DbId } from "schemas/utils";
import { z } from "zod"; 

const shared = {
  id: DbId,
  name: z.string().nullish(), 
}

const mapped = {
  sortOrder: z.int(),
}

const relations = {
  template: z.object({ 
    id: DbId 
  }),
  product: z.object({
    id: ProductSchema.shape.id.nullish(),
    name: ProductSchema.shape.name.nullish(),
  }),
  workstation: z.object({
    id: WorkstationSchema.shape.id.nullish(),
    name: WorkstationSchema.shape.name.nullish(),
  }),
}

export const BatchTemplateItemSchema = z.object({ ...mapped, ...shared, ...relations }).meta({ id: "BatchTemplateItem" }); 

export const BatchTemplateItemRowSchema = z.object({
  ...shared,
  template_id: relations.template.shape.id,
  sort_order: mapped.sortOrder,
  product_id: relations.product.shape.id,
  product_name: relations.product.shape.name,
  workstation_id: relations.workstation.shape.id,
  workstation_name: relations.workstation.shape.name,
})

export const BatchTemplateItemInsertSchema = BatchTemplateItemSchema.omit({ id: true }).partial({ product: true, workstation: true, sortOrder: true}).meta({ id: "BatchTemplateItemInsert" });

export const BatchTemplateItemFromRow = BatchTemplateItemRowSchema.transform((row): BatchTemplateItem => ({
  id: row.id,
  template: {
    id: row.template_id ,
  },
  sortOrder: row.sort_order,
  name: row.name,
  product: {
    id: row.product_id,
    name: row.product_name,
  },
  workstation: {
    id: row.workstation_id,
    name: row.workstation_name,
  }
}));

export const BatchTemplateItemLookupSchema = z.union([
  z.object({ id: z.number().positive() })
]);

export type BatchTemplateItem = z.infer<typeof BatchTemplateItemSchema>; 
export type BatchTemplateItemRow = z.infer<typeof BatchTemplateItemRowSchema>
export type BatchTemplateItemInsert = z.infer<typeof BatchTemplateItemInsertSchema>
export type BatchTemplateItemLookup = z.infer<typeof BatchTemplateItemLookupSchema>
