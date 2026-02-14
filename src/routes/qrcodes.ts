import { activateQRCodeController, createQRCodesController, getQRCodesController, getQRCodeController, scanQRCodeController } from "controllers/qrcodes";
import express from "express"
import { authenticate } from "middleware/auth";

const router = express.Router()

router.get('/', authenticate, getQRCodesController)
router.get('/:id', getQRCodeController)
router.get('/:id/scan', authenticate, scanQRCodeController)
router.post('/:id/activate', authenticate, activateQRCodeController)
router.post('/', authenticate, createQRCodesController)
router.post('/bulk', authenticate, createQRCodesController)

export default router;
