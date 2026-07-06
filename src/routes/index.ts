import express from "express"
import authRouter from "./authentication"
import productRouter from "./products"
import batchRouter from "./batches"
import qrcodeRouter from "./qrcodes"
import userRouter from "./users"
import databaseRouter from "./database"
import workstationRouter from "./workstations"

const router = express.Router()

router.use('/auth', authRouter) // 4 unique endpoints
router.use('/products', productRouter) // 1 unique endpoint
router.use('/batches', batchRouter) // 3 unique endpoints
router.use('/qrcodes', qrcodeRouter) // 2 unique endpoints
router.use('/users', userRouter) 
router.use('/workstations', workstationRouter)
router.use('/db', databaseRouter)

export default router;
