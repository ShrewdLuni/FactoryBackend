import express from "express";
import { Controller } from "abstract/controller";
import { ProductInsertSchema, ProductPatchSchema, type Product, type ProductInsert } from "./product.schema";
import { ProductService } from "./product.service";
import { asyncHandler } from "utils/errorHandler";
import { paramsSchema } from "schemas/utils";
import { packRequestSchema } from "schemas/productPack";
import type { ZodType } from "zod";

export class ProductController extends Controller<Product, ProductInsert, ProductService> {
  constructor(service: ProductService = new ProductService()) {
    super(service, ProductInsertSchema, ProductPatchSchema as ZodType<Partial<ProductInsert>>);
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
