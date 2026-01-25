import express from "express"
import { InsertWorkstationSchema, WokrstationFromDatabase, WorkstationsFromDatabase } from "schemas/workstations"
import { activateQRCode } from "services/qrCodes"
import { createWorkstation, deleteWorkstation, getAllWorkstations, getWorkstation, updateWorkstation } from "services/workstations"

export const getAllWorkstationsController = async (req: express.Request, res: express.Response) => {
  const databaseResult = await getAllWorkstations()
  const workstations = WorkstationsFromDatabase.parse(databaseResult)
  return res.status(200).json(workstations);
}

export const getWorkstationController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const result = await getWorkstation(id)
    const workstation = WokrstationFromDatabase.parse(result); 
    return res.status(200).json(workstation);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export const createWorkstationController = async (req: express.Request, res: express.Response) => {
  try {
    const data = InsertWorkstationSchema.parse(req.body); 
    const result = await createWorkstation(data); 
    const workstation = WokrstationFromDatabase.parse(result); 
    if (data.qr_code)
      await activateQRCode(data.qr_code, "workstation")
    return res.status(200).json(workstation);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export const updateWorkstationController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const data = InsertWorkstationSchema.parse(req.body); 
    const result = await updateWorkstation(id, data)
    const workstation = WokrstationFromDatabase.parse(result); 
    return res.status(200).json(workstation);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

export const deleteWorkstationController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }
    const result = await deleteWorkstation(id)
    const workstation = WokrstationFromDatabase.parse(result); 
    return res.status(200).json(workstation);
  } catch (error) {
    console.log(error);
    return res.status(500);
  }
}

