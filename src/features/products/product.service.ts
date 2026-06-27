import { Service } from "abstract/service";
import { ProductRepository } from "./product.repository";
import type { Product, ProductInsert, ProductLookup } from "./product.schema";
import type { QuantitiesByStatus } from "schemas/productQuantities";
import type { DefectsByProduct } from "schemas/defectQuantities";
import type { StorageEntry, StorageEntryInsert } from "features/storageEntries/storageEntry.schema";
import { StorageEntryRepository } from "features/storageEntries/storageEntry.repository";
import { transaction } from "db";

export class ProductService extends Service<Product, ProductInsert, ProductLookup, ProductRepository> {
  private storageEntryRepository: StorageEntryRepository;

  constructor(repo: ProductRepository = new ProductRepository(), storageEntryRepository: StorageEntryRepository = new StorageEntryRepository()){
    super(repo)
    this.storageEntryRepository = storageEntryRepository;
  }

  async findQuantities(): Promise<QuantitiesByStatus[]> {
    const products = await this.repository.findQuantities();
    return products;
  }

  async findDefects(): Promise<DefectsByProduct[]> {
    const defects = await this.repository.findDefects();
    return defects;
  }

  async packProduct(id: number, boxSize: number, quantity: number): Promise<StorageEntry[]> {
    const toInsert: StorageEntryInsert[] = Array.from({ length: quantity }, () => ({
      boxSize,
      product: { id },
    }));

    const product = await this.repository.find({ id })
    if (!product)  throw Error(`Product: ${id} not found`)
    if (product.quantity < (boxSize * quantity))  throw Error(`Moved amount is greater then packed stock`)

    return transaction(async (client) => {
      this.repository.patch(id, { quantity: product.quantity - (quantity * boxSize) })
      return this.storageEntryRepository.createMany(toInsert);
    }); 
  }
}
