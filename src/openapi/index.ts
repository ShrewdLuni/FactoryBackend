import { createDocument } from "zod-openapi";
import { buildCrudPaths } from "./buildCrudPaths";
import { UserSchema, UserInsertSchema } from "features/users/user.schema";
import { RoleSchema, RoleInsertSchema } from "features/roles/role.schema";
import { DepartmentSchema, DepartmentInsertSchema } from "features/departments/department.schema";
import { WorkstationSchema, WorkstationInsertSchema } from "features/workstations/workstation.schema";
import { MeasureUnitSchema, MeasureUnitInsertSchema } from "features/measureUnits/measureUnit.schema";
import { BatchStatusInsertSchema, BatchStatusSchema } from "features/batchStatuses/batchStatus.schema";
import { DefectTypeSchema, DefectTypeInsertSchema } from "features/defectTypes/defectType.schema";
import { DeviceInsertSchema, DeviceSchema } from "features/devices/devices.schema";
import { PackedStockInsertSchema, PackedStockSchema } from "features/packedStock/packedStock.schema";
import { ProductInsertSchema, ProductSchema } from "features/products/product.schema";
import { QRCodeInsertSchema, QRCodeSchema } from "features/qrcodes/qrcode.schema";
import { BatchInsertSchema, BatchSchema } from "features/batches/batch.schema";
import { DefectInsertSchema, DefectSchema } from "features/defects/defect.schema";
import { StorageEntryInsertSchema, StorageEntrySchema } from "features/storageEntries/storageEntry.schema";
import { QuantitiesByStatusSchema } from "schemas/productQuantities";
import { DefectsByProductSchema } from "schemas/defectQuantities";
import { BatchTransitionSchema, BatchTransitionInsertSchema } from "features/batchTransitions/batchTransitions.schema";
import { paramsSchema } from "schemas/utils";
import { packRequestSchema } from "schemas/productPack";

export function generateOpenApiDoc() {
  return createDocument({
    openapi: "3.1.0",
    info: { title: "API", version: "1.0.0" },
    servers: [{ url: "/" }],
    paths: {
      ...buildCrudPaths({
        resource: "batchStatuses",
        tag: "BatchStatus",
        pluralTag: "BatchStatuses",
        entitySchema: BatchStatusSchema,
        insertSchema: BatchStatusInsertSchema,
      }),
      // ...buildCrudPaths({ resource: "batchStatuses", tag: "BatchStatus", entitySchema: BatchStatusSchema, insertSchema: BatchStatusInsertSchema }),
      // ...buildCrudPaths({ resource: "batchStatuses", tag: "BatchStatus", entitySchema: BatchStatusSchema, insertSchema: BatchStatusInsertSchema }),
      ...buildCrudPaths({
        resource: "batchTransitions",
        tag: "BatchTransition",
        pluralTag: "BatchTransitions",
        entitySchema: BatchTransitionSchema,
        insertSchema: BatchTransitionInsertSchema,
      }),
      ...buildCrudPaths({
        resource: "batches",
        tag: "Batch",
        pluralTag: "Batches",
        entitySchema: BatchSchema,
        insertSchema: BatchInsertSchema,
        extra: {
          "/batches/expanded": {
            get: {
              tags: ["Batch"],
              operationId: "getAllBatchesWithAll",
              responses: {
                "200": {
                  description: "OK",
                  content: {
                    "application/json": {
                      schema: BatchSchema.array(),
                    },
                  },
                },
              },
            },
          },
        },
      }),
      ...buildCrudPaths({
        resource: "defectTypes",
        tag: "DefectType",
        entitySchema: DefectTypeSchema,
        insertSchema: DefectTypeInsertSchema,
      }),
      ...buildCrudPaths({
        resource: "defects",
        tag: "Defect",
        entitySchema: DefectSchema,
        insertSchema: DefectInsertSchema,
      }),
      ...buildCrudPaths({
        resource: "departments",
        tag: "Department",
        entitySchema: DepartmentSchema,
        insertSchema: DepartmentInsertSchema,
      }),
      ...buildCrudPaths({
        resource: "devices",
        tag: "Device",
        entitySchema: DeviceSchema,
        insertSchema: DeviceInsertSchema,
      }),
      ...buildCrudPaths({
        resource: "measureUnits",
        tag: "MeasureUnit",
        entitySchema: MeasureUnitSchema,
        insertSchema: MeasureUnitInsertSchema,
      }),
      ...buildCrudPaths({
        resource: "packedStock",
        tag: "PackedStock",
        pluralTag: "PackedStock",
        entitySchema: PackedStockSchema,
        insertSchema: PackedStockInsertSchema,
      }),
      ...buildCrudPaths({
        resource: "products",
        tag: "Product",
        entitySchema: ProductSchema,
        insertSchema: ProductInsertSchema,
        extra: {
          "/products/quantities": {
            get: {
              tags: ["Product"],
              operationId: "getProductQuantities",
              responses: {
                "200": {
                  description: "OK",
                  content: { "application/json": { schema: QuantitiesByStatusSchema.array() } },
                },
              },
            },
          },
          "/products/defects": {
            get: {
              tags: ["Product"],
              operationId: "getProductDefects",
              responses: {
                "200": {
                  description: "OK",
                  content: { "application/json": { schema: DefectsByProductSchema.array() } },
                },
              },
            },
          },
          "/products/{id}/pack": {
            post: {
              tags: ["Product"],
              operationId: "packProduct",
              requestParams: {
                path: paramsSchema,
              },
              requestBody: {
                content: { "application/json": { schema: packRequestSchema } },
              },
              responses: {
                "200": {
                  description: "OK",
                  content: { "application/json": { schema: StorageEntrySchema.array() } },
                },
                "404": { description: "Product or packed stock entry not found" },
                "409": { description: "Insufficient packed stock" },
              },
            },
          },
        },
      }),
      ...buildCrudPaths({
        resource: "qrcodes",
        tag: "QRCode",
        entitySchema: QRCodeSchema,
        insertSchema: QRCodeInsertSchema,
      }),
      ...buildCrudPaths({ resource: "roles", tag: "Role", entitySchema: RoleSchema, insertSchema: RoleInsertSchema }),
      ...buildCrudPaths({
        resource: "storageEntries",
        tag: "StorageEntry",
        pluralTag: "StorageEntries",
        entitySchema: StorageEntrySchema,
        insertSchema: StorageEntryInsertSchema,
      }),
      ...buildCrudPaths({ resource: "users", tag: "User", entitySchema: UserSchema, insertSchema: UserInsertSchema }),
      ...buildCrudPaths({
        resource: "workstations",
        tag: "Workstation",
        entitySchema: WorkstationSchema,
        insertSchema: WorkstationInsertSchema,
      }),
    },
  });
}
