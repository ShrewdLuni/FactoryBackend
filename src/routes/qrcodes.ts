import { activateQRCodeController, createQRCodesController, getQRCodesController, getQRCodeController } from "controllers/qrcodes";
import express from "express"

const router = express.Router()

router.get('/', getQRCodesController)
router.get('/:id', getQRCodeController)
router.post('/:id/activate', activateQRCodeController)
router.post('/', createQRCodesController)

export default router;
