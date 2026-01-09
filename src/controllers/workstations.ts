import express from "express"
import { InsertWorkstationSchema, WokrstationFromDatabase, WorkstationsFromDatabase } from "schemas/workstations"
import { createWorkstation, getAllWorkstations } from "services/workstations"

export const getAllWorkstationsController = async (req: express.Request, res: express.Response) => {
  const databaseResult = await getAllWorkstations()
  const workstations = WorkstationsFromDatabase.parse(databaseResult)
  return res.status(200).json(workstations);
}

export const createWorkstationController = async (req: express.Request, res: express.Response) => {
  try {
    const data = InsertWorkstationSchema.parse(req.body); 
    const result = await createWorkstation(data); 
    const workstation = WokrstationFromDatabase.parse(result); 
    return res.status(200).json(workstation);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}
