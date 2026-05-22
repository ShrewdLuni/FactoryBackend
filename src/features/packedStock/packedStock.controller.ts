import { Controller } from "abstract/controller";
import { PackedStockInsertSchema, type PackedStock, type PackedStockInsert } from "./packedStock.schema";
import { PackedStockService } from "./packedStock.service";

export class PackedStockController extends Controller<PackedStock, PackedStockInsert, PackedStockService> {
  constructor(service: PackedStockService = new PackedStockService()) {
    super(service, PackedStockInsertSchema);
  }
}
