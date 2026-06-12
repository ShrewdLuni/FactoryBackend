import { Service } from "abstract/service";
import { ProductRepository } from "./product.repository";
import type { Product, ProductInsert, ProductLookup } from "./product.schema";
import type { QuantitiesByStatus } from "schemas/productQuantities";

export class ProductService extends Service<Product, ProductInsert, ProductLookup, ProductRepository> {
  constructor(repo: ProductRepository = new ProductRepository()){
    super(repo)
  }

  async findQuantities(): Promise<QuantitiesByStatus[]> {
    const products = await this.repository.findQuantities();
    return products;
  }
}
