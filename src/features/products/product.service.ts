import { Service } from "abstract/service";
import { ProductRepository } from "./product.repository";
import type { Product, ProductInsert, ProductLookup } from "./product.schema";

export class ProductService extends Service<Product, ProductInsert, ProductLookup, ProductRepository> {
  constructor(repo: ProductRepository = new ProductRepository()){
    super(repo)
  }
}
