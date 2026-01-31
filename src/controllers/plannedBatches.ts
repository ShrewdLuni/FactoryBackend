import { query } from "db";
import express from "express"
import { InsertPlannedBatchSchema, PlannedBatchesFromDatabase, PlannedBatchFromDatabase, type InsertPlannedBatch, type PlannedBatch } from "schemas/plannedBatches";
import { WorkstationsFromDatabase } from "schemas/workstations";
import { createPlannedBatch, deletePlannedBatch, getAllPlannedBatches, getPlannedBatch, updatePlannedBatch } from "services/plannedBatches";
import { getAllWorkstations } from "services/workstations";

export const getPlannedBatchesController = async (req: express.Request, res: express.Response) => {
  const databaseResult = await getAllPlannedBatches()
  const plannedBatches = PlannedBatchesFromDatabase.parse(databaseResult)
  return res.status(200).json(plannedBatches);
}

export const getPlannedBatchController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const result = await getPlannedBatch(id)
    const plannedBatch = PlannedBatchFromDatabase.parse(result); 
    return res.status(200).json(plannedBatch);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export const createPlannedBatchController = async (req: express.Request, res: express.Response) => {
  try {
    const data = InsertPlannedBatchSchema.parse(req.body); 
    const result = await createPlannedBatch(data); 
    const plannedBatch = PlannedBatchFromDatabase.parse(result); 
    return res.status(200).json(plannedBatch);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export const updatePlannedBatchController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const data = InsertPlannedBatchSchema.parse(req.body); 
    const result = await updatePlannedBatch(id, data)
    const plannedBatch = PlannedBatchFromDatabase.parse(result); 
    return res.status(200).json(plannedBatch);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}
