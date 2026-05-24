import { createDocument } from "zod-openapi";
import { buildCrudPaths } from "./buildCrudPaths";
import { UserSchema, UserInsertSchema } from "features/users/user.schema";
import { RoleSchema, RoleInsertSchema } from "features/roles/role.schema";
import { DepartmentSchema, DepartmentInsertSchema } from "features/departments/department.schema";
import { WorkstationSchema, WorkstationInsertSchema } from "features/workstations/workstation.schema"
import { MeasureUnitSchema, MeasureUnitInsertSchema } from  "features/measureUnits/measureUnit.schema"
import { BatchStatusInsertSchema, BatchStatusSchema } from "schemas/batchStatuses";
import { DefectTypeSchema, DefetTypeInsertSchema } from "schemas/defectTypes";
import { DeviceInsertSchema, DeviceSchema } from "features/devices/devices.schema";
import { PackedStockInsertSchema, PackedStockSchema } from "features/packedStock/packedStock.schema";
import { ProductInsertSchema, ProductSchema } from "features/products/product.schema";
import { QRCodeInsertSchema, QRCodeSchema } from "features/qrcodes/qrcode.schema";
import { BatchInsertSchema, BatchSchema } from "features/batches/batch.schema";
import { DefectInsertSchema, DefectSchema } from "features/defects/defect.schema";


export function generateOpenApiDoc() {
  return createDocument({
    openapi: "3.1.0",
    info: { title: "API", version: "1.0.0" },
    servers: [{ url: "/" }],
    paths: {
      ...buildCrudPaths({ resource: "batchStatuses", tag: "BatchStatus", entitySchema: BatchStatusSchema, insertSchema: BatchStatusInsertSchema }),
      // ...buildCrudPaths({ resource: "batchStatuses", tag: "BatchStatus", entitySchema: BatchStatusSchema, insertSchema: BatchStatusInsertSchema }),
      // ...buildCrudPaths({ resource: "batchStatuses", tag: "BatchStatus", entitySchema: BatchStatusSchema, insertSchema: BatchStatusInsertSchema }),
      ...buildCrudPaths({ resource: "batches", tag: "Batch", entitySchema: BatchSchema, insertSchema: BatchInsertSchema }),
      ...buildCrudPaths({ resource: "defectTypes", tag: "DefectType", entitySchema: DefectTypeSchema, insertSchema: DefetTypeInsertSchema }),
      ...buildCrudPaths({ resource: "defects", tag: "Defect", entitySchema: DefectSchema, insertSchema: DefectInsertSchema }),
      ...buildCrudPaths({ resource: "departments", tag: "Department", entitySchema: DepartmentSchema, insertSchema: DepartmentInsertSchema }),
      ...buildCrudPaths({ resource: "devices", tag: "Device", entitySchema: DeviceSchema, insertSchema: DeviceInsertSchema }),
      ...buildCrudPaths({ resource: "measureUnits", tag: "MeasureUnit", entitySchema: MeasureUnitSchema, insertSchema: MeasureUnitInsertSchema }),
      ...buildCrudPaths({ resource: "packedStock", tag: "PackedStock", entitySchema: PackedStockSchema, insertSchema: PackedStockInsertSchema }),
      ...buildCrudPaths({ resource: "products", tag: "Product", entitySchema: ProductSchema, insertSchema: ProductInsertSchema }),
      ...buildCrudPaths({ resource: "qrcodes", tag: "qrcode", entitySchema: QRCodeSchema, insertSchema: QRCodeInsertSchema }),
      ...buildCrudPaths({ resource: "roles", tag: "Role", entitySchema: RoleSchema, insertSchema: RoleInsertSchema }),
      ...buildCrudPaths({ resource: "users", tag: "User", entitySchema: UserSchema, insertSchema: UserInsertSchema }),
      ...buildCrudPaths({ resource: "workstations", tag: "Workstation", entitySchema: WorkstationSchema, insertSchema: WorkstationInsertSchema }),
    },
  });
}
