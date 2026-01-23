import { createProduct, getProducts, updateProduct } from "services/products";
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

export const updateProductController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const data = InsertProductSchema.parse(req.body); 
    const result = await updateProduct(id, data)
    const product = ProductFromDatabase.parse(result); 
    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}
