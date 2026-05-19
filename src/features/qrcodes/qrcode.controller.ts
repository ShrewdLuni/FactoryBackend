import express from "express";
import { Controller } from "abstract/controller";
import { QRCodeInsertSchema, type QRCode, type QRCodeInsert } from "./qrcode.schema";
import { QRCodeService } from "./qrcode.service";
import { asyncHandler } from "utils/errorHandler";
import { paramsSchema } from "schemas/utils";
import { CLIENT_URL } from "config";

export class QRCodeController extends Controller<QRCode, QRCodeInsert, QRCodeService> {
  constructor(service: QRCodeService = new QRCodeService()) {
    super(service, QRCodeInsertSchema);
  }

  scan = asyncHandler(async (req: express.Request, res: express.Response) => {
    const { id } = paramsSchema.parse(req.params);
    const result = await this.service.find(id);
    if (result.resource) return res.redirect(result.resource);
    return res.redirect(`${CLIENT_URL}/qrcodes/${result.id}`)
  });
}
