import { Repository } from "abstract/repository";
import {
  ProductFromRow,
  type Product,
  type ProductInsert,
  type ProductLookup,
  type ProductRow,
} from "./product.schema";

export class ProductRepository extends Repository<Product, ProductRow, ProductLookup, ProductInsert> {
  constructor() {
    super("products", ProductFromRow, {
      name: "name",
      code: "code",
      measureUnit: {
        column: "measure_unit_id",
        extract: (d) => d.measureUnit.id,
      },
      isActive: "isActive",
    });
  }
}
