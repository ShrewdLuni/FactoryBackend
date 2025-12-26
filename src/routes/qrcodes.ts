import { createQRCodesController, getQRCodesController } from "controllers/qrcodes";
import express from "express"

const router = express.Router()

router.get('/', getQRCodesController)
router.post('/', createQRCodesController)

export default router;
