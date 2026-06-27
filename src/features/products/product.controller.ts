import { Controller } from "abstract/controller";
import { ProductInsertSchema, type Product, type ProductInsert } from "./product.schema";
import { ProductService } from "./product.service";
import express from "express";
import { asyncHandler } from "utils/errorHandler";
import { paramsSchema } from "schemas/utils";
import { packRequestSchema } from "schemas/productPack";

export class ProductController extends Controller<Product, ProductInsert, ProductService> {
  constructor(service: ProductService = new ProductService()) {
    super(service, ProductInsertSchema);
  }

  findQuantities = asyncHandler(async (_req: express.Request, res: express.Response) => {
    const result = await this.service.findQuantities();
    res.status(200).json(result);
  });

  findDefects = asyncHandler(async (_req: express.Request, res: express.Response) => {
    const result = await this.service.findDefects();
    res.status(200).json(result);
  });

  packProduct = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { id } = paramsSchema.parse(req.params);
    const data = packRequestSchema.parse(req.body);
    const result = await this.service.packProduct(id, data.boxSize, data.quantity);
    res.status(200).json(result);
  });
}
