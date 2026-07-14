import { Repository } from "abstract/repository";
import {
  PackedStockFromRow,
  type PackedStock,
  type PackedStockInsert,
  type PackedStockLookup,
  type PackedStockRow,
} from "./packedStock.schema";
import { query } from "db";

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

  async findMany(): Promise<PackedStock[]> {
    const result = await query<PackedStockRow>(`SELECT s.*, p.box_size as product_box_size, p.name as product_name FROM packed_stock s JOIN products p on s.product_id = p.id;`)
    return PackedStockFromRow.array().parse(result.rows);
  }
}
