import { Repository } from "abstract/repository";
import {
  PackedStockFromRow,
  type PackedStock,
  type PackedStockInsert,
  type PackedStockLookup,
  type PackedStockRow,
} from "./packedStock.schema";

export class PackedStockRepository extends Repository<
  PackedStock,
  PackedStockRow,
  PackedStockLookup,
  PackedStockInsert
> {
  constructor() {
    super("packed_stock", PackedStockFromRow, {
      quantity: "quantity",
      product: { column: "product_id", extract: (d) => d.product?.id }
    });
  }
}
