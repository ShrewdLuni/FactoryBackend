import express from "express"
import { CLIENT_URL } from "config"
import { InsertWorkstationSchema, WokrstationFromDatabase, WorkstationsFromDatabase } from "schemas/workstations"
import { activateQRCode } from "services/qrCodes"
import { createWorkstation, deleteWorkstation, getAllWorkstations, getWorkstation, updateWorkstation } from "services/workstations"
import { paramsSchema } from "schemas/utils"
import { asyncHandler, HttpError } from "utils/errorHandler"

export const getAllWorkstationsController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const databaseResult = await getAllWorkstations()
  const workstations = WorkstationsFromDatabase.parse(databaseResult)
  res.status(200).json(workstations);
})

export const getWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const result = await getWorkstation(id)
  if (!result) throw new HttpError(404, `Workstation with ID ${id} not found`);
  const workstation = WokrstationFromDatabase.parse(result); 
  res.status(200).json(workstation);
})

export const createWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const data = InsertWorkstationSchema.parse(req.body); 
  const result = await createWorkstation(data); 
  const workstation = WokrstationFromDatabase.parse(result); 
  const qrCode = await activateQRCode(data.qrCode, `${CLIENT_URL}/workstations/${workstation.id}`)
  if (!qrCode) throw new HttpError(404, `QR-Code with ID ${data.qrCode} not found`);
  res.status(201).json(workstation);
})

export const updateWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const data = InsertWorkstationSchema.parse(req.body); 
  const result = await updateWorkstation(id, data)
  if (!result) throw new HttpError(404, `Workstation with ID ${id} not found`);
  const workstation = WokrstationFromDatabase.parse(result); 
  res.status(200).json(workstation);
})

export const deleteWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const result = await deleteWorkstation(id)
  if (!result) throw new HttpError(404, `Workstation with ID ${id} not found`);
  const workstation = WokrstationFromDatabase.parse(result); 
  res.status(200).json(workstation);
})
