import { createProduct, getProducts } from "services/products";
import express from "express"
import { InsertProductSchema, ProductFromDatabase, ProductsFromDatabase } from "schemas/products";

export const createProductController = async (req: express.Request, res: express.Response) => {
  try {
    const product = InsertProductSchema.parse(req.body);

    if(!product){
      return res.sendStatus(400);
    }

    const databaseResult = await createProduct(product);
    const result = ProductFromDatabase.parse(databaseResult);
    return result;
  } catch(error) {
    return res.sendStatus(500);
  }
}

export const getProductsController = async (req: express.Request, res: express.Response) => {
  try {
    const result = await getProducts();
    const products = ProductsFromDatabase.parse(result);
    return res.status(200).json(products);
  } catch (error){
    console.log(error);
    return res.sendStatus(500);
  }
}
