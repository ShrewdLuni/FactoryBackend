import express from 'express'
import z from 'zod';
import { InitializeBatchSchema } from "schemas/batches";
import { getAllBatchesWithProducts, createBatches, scanBatch, getBatch } from "../services/batches"

export const getBatchController = async (req: express.Request, res: express.Response) => {
  try {
    
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const data = await getBatch(id)
    return res.status(200).json(data);
  } catch (error) {
    console.log(error)
    return res.status(500);
  }

}

export const getAllBatchesController = async (req: express.Request, res: express.Response) => {
   try {
    const data = await getAllBatchesWithProducts();
    return res.status(200).json(data);
   } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export const scanBatchController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id === undefined) {
      return res.status(400).json({ error: 'Invalid data provided'})
    }

    const batchId = parseInt(req.params.id);

    if(isNaN(batchId)) {
      return res.status(400).json({ error: 'Invalid data provided'})
    }

    const data = await scanBatch(batchId)
    return res.status(200).json(data);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export const createBatchControler = async (req: express.Request, res: express.Response) => {
  try {
    console.log(req.body)
    const { batch, amount } = InitializeBatchSchema.parse(req.body);
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
