import { Controller } from "abstract/controller";
import { QRCodeInsertSchema, type QRCode, type QRCodeInsert } from "./qrcode.schema";
import { QRCodeService } from "./qrcode.service";

export class QRCodeController extends Controller<QRCode, QRCodeInsert, QRCodeService> {
  constructor(service: QRCodeService = new QRCodeService()) {
    super(service, QRCodeInsertSchema);
  }
}
