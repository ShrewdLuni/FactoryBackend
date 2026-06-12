import { Controller } from "abstract/controller";
import { ProductInsertSchema, type Product, type ProductInsert } from "./product.schema";
import { ProductService } from "./product.service";
import express from "express";
import { asyncHandler } from "utils/errorHandler";

export class ProductController extends Controller<Product, ProductInsert, ProductService> {
  constructor(service: ProductService = new ProductService()) {
    super(service, ProductInsertSchema);
  }

  findQuantities = asyncHandler(async (_req: express.Request, res: express.Response) => {
    const result = await this.service.findQuantities();
    res.status(200).json(result);
  });

}
