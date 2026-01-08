import { activateQRCodeController, createQRCodesController, getQRCodesController, getQRCodeController, scanQRCodeController } from "controllers/qrcodes";
import express from "express"

const router = express.Router()

router.get('/', getQRCodesController)
router.get('/:id', getQRCodeController)
router.get('/:id/scan', scanQRCodeController)
router.post('/:id/activate', activateQRCodeController)
router.post('/', createQRCodesController)

export default router;
