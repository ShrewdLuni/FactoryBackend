import { activateQRCodeController, createQRCodesController, getQRCodesController, getQRCodeController, scanQRCodeController, updateQRCodeController, createQRCodeController, deleteQRCodeController } from "controllers/qrcodes";
import express from "express"
import { authenticate } from "middleware/auth";

const router = express.Router()

router.get('/', authenticate, getQRCodesController)
router.get('/:id', getQRCodeController)
router.post('/', authenticate, createQRCodeController)
router.post('/bulk', authenticate, createQRCodesController)
router.put('/:id', authenticate, updateQRCodeController)
router.delete('/:id', authenticate, deleteQRCodeController)
router.patch('/:id/activate', authenticate, activateQRCodeController)
router.get('/:id/scan', scanQRCodeController)

export default router;
