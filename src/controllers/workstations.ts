import express from "express"
import { CLIENT_URL } from "config"
import { InsertWorkstationSchema, WokrstationFromDatabase, WorkstationsFromDatabase } from "schemas/workstations"
import { qrcodeService } from "services/qrCodes"
import { paramsSchema } from "schemas/utils"
import { asyncHandler, HttpError } from "utils/errorHandler"
import { workstationService as service } from "services/workstations"

export const getAllWorkstationsController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const databaseResult = await service.getAll()
  const workstations = WorkstationsFromDatabase.parse(databaseResult)
  res.status(200).json(workstations);
})

export const getWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const result = await service.get(id)
  if (!result) throw new HttpError(404, `Workstation with ID ${id} not found`);
  const workstation = WokrstationFromDatabase.parse(result); 
  res.status(200).json(workstation);
})

export const createWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const data = InsertWorkstationSchema.parse(req.body); 
  const result = await service.create(data); 
  const workstation = WokrstationFromDatabase.parse(result); 
  const qrCode = await qrcodeService.activate(data.qrCode, `${CLIENT_URL}/workstations/${workstation.id}`)
  if (!qrCode) throw new HttpError(404, `QR-Code with ID ${data.qrCode} not found`);
  res.status(201).json(workstation);
})

export const updateWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const data = InsertWorkstationSchema.parse(req.body); 
  const result = await service.update(id, data)
  if (!result) throw new HttpError(404, `Workstation with ID ${id} not found`);
  const workstation = WokrstationFromDatabase.parse(result); 
  res.status(200).json(workstation);
})

export const deleteWorkstationController = asyncHandler(async (req: express.Request, res: express.Response) => {
  const { id } = paramsSchema.parse(req.params)
  const result = await service.delete(id)
  if (!result) throw new HttpError(404, `Workstation with ID ${id} not found`);
  const workstation = WokrstationFromDatabase.parse(result); 
  res.status(200).json(workstation);
})
