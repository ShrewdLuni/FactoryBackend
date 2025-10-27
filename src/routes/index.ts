import express from "express"
import authRouter from "./authentication"
import productRouter from "./products"
import databaseRouter from "./database"

const router = express.Router()

router.use('/auth', authRouter)
router.use('/product', productRouter)
router.use('/db', databaseRouter)

export default router;
