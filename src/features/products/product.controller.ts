import { Controller } from "abstract/controller";
import { ProductInsertSchema, type Product, type ProductInsert } from "./product.schema";
import { ProductService } from "./product.service";

export class ProductController extends Controller<Product, ProductInsert, ProductService> {
  constructor(service: ProductService = new ProductService()) {
    super(service, ProductInsertSchema);
  }
}
