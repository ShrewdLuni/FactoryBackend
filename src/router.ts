import express from "express";

import authRouter from "features/auth/auth.routes";
import batchStatusRouter from "features/batchStatuses/batchStatus.routes";
// import batchTemplateItemRouter from "features/batchTemplateItems/batchTemplateItems.routes"
// import batchTemplatRouter from "features/batchTemplates/batchTemplates.routes"
import batchTransitionRouter from "features/batchTransitions/batchTransitions.routes";
import batchRouter from "features/batches/batch.routes"
import defectTypeRouter from "features/defectTypes/defectType.routes";
import defectRouter from "features/defects/defect.routes"
import departmentRouter from "features/departments/department.routes";
import deviceRouter from "features/devices/devices.routes";
import measureUnitRouter from "features/measureUnits/measureUnit.routes";
// import mediaRouter from "features/media/media.routes"
import packedStockRouter from "features/packedStock/packedStock.routes";
import productRouter from "features/products/product.routes";
import qrcodeRouter from "features/qrcodes/qrcode.routes";
import roleRouter from "features/roles/role.routes";
import storageEntryRouter from "features/storageEntries/storageEntry.routes";
import userRouter from "features/users/user.routes";
import workstationRouter from "features/workstations/workstation.routes";
import shiftRouter from "features/shifts/shift.routes"
import databaseRouter from "routes/database";

const router = express.Router();

router.use("/auth", authRouter);
router.use("/batchStatuses", batchStatusRouter);
// router.use('/batchtemplateItems', batchTemplateItemRouter)
// router.use('/batchTemplates', batchTemplateRouter)
router.use('/batchTransitions', batchTransitionRouter)
router.use('/batches', batchRouter)
router.use("/defectTypes", defectTypeRouter);
router.use('/defects', defectRouter)
router.use("/departments", departmentRouter);
router.use("/devices", deviceRouter);
router.use("/measureUnits", measureUnitRouter);
// router.use('/media', mediaRouter)
router.use("/packedStock", packedStockRouter);
router.use("/products", productRouter);
router.use("/qrcodes", qrcodeRouter);
router.use("/roles", roleRouter);
router.use('/storageEntries', storageEntryRouter)
router.use("/users", userRouter);
router.use("/workstations", workstationRouter);
router.use("/shifts", shiftRouter);
router.use("/db", databaseRouter);

export default router;
