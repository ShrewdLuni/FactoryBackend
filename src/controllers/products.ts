import { createProduct, getProducts } from "services/products";
import express from "express"
import { insertProductSchema } from "schemas/products";

export const createProductController = async (req: express.Request, res: express.Response) => {
  try {
    const product = insertProductSchema.parse(req.body);

    if(!product){
      return res.sendStatus(400);
    }
    const result = await createProduct(product);
    return result;
  } catch(error) {
    return res.sendStatus(500);
  }
}

export const getProductsController = async (req: express.Request, res: express.Response) => {
  try {
    const result = await getProducts();
    return res.status(200).json(result);
  }
  catch (error){
    console.log(error);
    return res.sendStatus(500);
  }
}
