import express from 'express'
import z from 'zod';
import { initializeBatchSchema } from "schemas/batches";
import { getAllBatchesWithProducts, createBatches } from "../services/batches"

export const getAllBatchesController = async (req: express.Request, res: express.Response) => {
   try {
    const data = await getAllBatchesWithProducts();
    return res.status(200).json(data);
   } catch (error) {
     console.log(error);
    return res.status(500);
  }
}

export const createBatchControler = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.body)
    const {batch, amount } = initializeBatchSchema.parse(req.body);
    console.log(batch, amount)
    const data = await createBatches(batch, amount);
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    if (error instanceof z.ZodError) {
      return res.status(400).json("Invalid data was provided")
    }

    return res.status(500);
  }
}
