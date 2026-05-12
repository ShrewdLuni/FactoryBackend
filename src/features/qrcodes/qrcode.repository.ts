import { Repository } from "abstract/repository";
import { QRCodeFromRow, type QRCode, type QRCodeInsert, type QRCodeLookup, type QRCodeRow } from "./qrcode.schema";

export class QRCodeRepository extends Repository<QRCode, QRCodeRow, QRCodeLookup, QRCodeInsert> {
  constructor() {
    super("qr_codes", QRCodeFromRow, { name: "name", resource: "resource", isActive: "is_active" });
  }
}
