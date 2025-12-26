import express from "express"
import { initializeQRCodeSchema} from "schemas/qrcode"
import { createQRCodes, getQRCodes } from "services/qrCodes"

export const getQRCodesController = async (req: express.Request, res: express.Response) => {
  try {
    const data = await getQRCodes()
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
