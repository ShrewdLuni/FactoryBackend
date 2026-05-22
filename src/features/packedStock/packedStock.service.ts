import { Service } from "abstract/service";
import { PackedStockRepository } from "./packedStock.repository";
import type { PackedStock, PackedStockInsert, PackedStockLookup } from "./packedStock.schema";

export class PackedStockService extends Service<PackedStock, PackedStockInsert, PackedStockLookup, PackedStockRepository> {
  constructor(repo: PackedStockRepository = new PackedStockRepository()){
    super(repo)
  }
}
