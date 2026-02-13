import express from "express"
import { InsertProductSchema, ProductFromDatabase, ProductsFromDatabase } from "schemas/products";
import { asyncHandler, HttpError } from "utils/errorHandler";
import { productsService as service } from "services/products";
import { paramsSchema } from "schemas/utils";

export const getProductsController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const result = await service.getAll()
  const products = ProductsFromDatabase.parse(result);
  res.status(200).json(products);
})

export const getProductController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const databaseResult = await service.get(id)
  if (!databaseResult) throw new HttpError(404, `Product with ID ${id} not found`);
  const product = ProductFromDatabase.parse(databaseResult); 
  res.status(200).json(product);
})

export const createProductController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const product = InsertProductSchema.parse(req.body);
  const databaseResult = await service.create(product);
  const result = ProductFromDatabase.parse(databaseResult);
  res.status(201).json(result)
})

export const updateProductController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const data = InsertProductSchema.parse(req.body); 
  const databaseResult = await service.update(id, data)
  if (!databaseResult) throw new HttpError(404, `Product with ID ${id} not found`);
  const product = ProductFromDatabase.parse(databaseResult); 
  res.status(200).json(product);
})

export const deleteProductController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const databaseResult = await service.delete(id)
  if (!databaseResult) throw new HttpError(404, `Product with ID ${id} not found`);
  const product = ProductFromDatabase.parse(databaseResult); 
  res.status(200).json(product);
})
