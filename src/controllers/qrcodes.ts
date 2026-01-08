import express from "express"
import { initializeQRCodeSchema} from "schemas/qrcode"
import { createQRCodes, getQRCodes, activateQRCode, getQRCodeById } from "services/qrCodes"
import QRCode from 'qrcode';
import { BASE_URL } from "config";

export const getQRCodesController = async (req: express.Request, res: express.Response) => {
  try {
    const data = await getQRCodes()

    const qrCodesWithImages = await Promise.all(
      data.map(async (record) => {
        const scanUrl = `${BASE_URL}/api/qrcodes/${record.id}/scan`;
        const qrCodeDataUrl = await QRCode.toDataURL(scanUrl, {
          width: 300,
          margin: 2,
          errorCorrectionLevel: 'M'
        });
        
        return {
          ...record,
          qrcodeImage: qrCodeDataUrl,
          scanUrl: scanUrl
        };
      })
    );

    return res.status(200).json(qrCodesWithImages)
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

    const data = await getQRCodeById(id)
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

export const scanQRCodeController = async (req: express.Request, res: express.Response) => {
  try {
    if (req.params.id === undefined) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const id = parseInt(req.params.id)

    if (isNaN(id)) {
      return res.status(400).json({message: "Invalid data was provided"})
    }

    const qrCode = await getQRCodeById(id);
    
    if (!qrCode) {
      return res.status(404).send('QR Code not found');
    }
    
    if (qrCode.resource) {
      return res.redirect(qrCode.resource);
    }
    
    return res.status(200).send(`QR Code "${qrCode.name}" - No resource linked yet`);
  } catch (error) {
    console.log(error);
    return res.status(500).send('Error processing scan');
  }
}
