import express from "express"
import { initializeQRCodeSchema} from "schemas/qrcode"
import { createQRCodes, getQRCodes, getQRCode, activateQRCode } from "services/qrCodes"

export const getQRCodesController = async (req: express.Request, res: express.Response) => {
  try {
    const data = await getQRCodes()
    return res.status(200).json(data)
  } catch (error) {
    console.log(error)
    return res.status(500);
  }
}

export const getQRCodeController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id === undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const data = await getQRCode(id)
    return res.status(200).json(data)
  } catch (error) {
    console.log(error)
    return res.status(500);
  }
}

export const createQRCodesController = async (req: express.Request, res: express.Response) => {
  try {
    const { qrcode, amount } = initializeQRCodeSchema.parse(req.body); 
    console.log(qrcode, amount)

    const data = await createQRCodes(qrcode, amount)
    return res.status(200).json(data);
  } catch (error) {
    console.log(error)
    return res.status(500);
  }
}

export const activateQRCodeController = async (req: express.Request, res: express.Response) => {
  try {
    
    if (req.params.id == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const resource = req.body.resource; 

    if(resource == undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const data = await activateQRCode(id, resource)
    return res.status(200).json(data);
  } catch (error) {
    console.log(error)
    return res.status(500);
  }

}
