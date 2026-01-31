import express from "express"
import authRouter from "./authentication"
import productRouter from "./products"
import batchRouter from "./batches"
import qrcodeRouter from "./qrcodes"
import userRouter from "./users"
import databaseRouter from "./database"
import workstationRouter from "./workstations"
import plannedBatchRouter from "./plannedBatches"

const router = express.Router()

router.use('/auth', authRouter)
router.use('/products', productRouter)
router.use('/batches', batchRouter)
router.use('/qrcodes', qrcodeRouter)
router.use('/users', userRouter)
router.use('/workstations', workstationRouter)
router.use('/planned-batch', plannedBatchRouter)
router.use('/db', databaseRouter)

export default router;
