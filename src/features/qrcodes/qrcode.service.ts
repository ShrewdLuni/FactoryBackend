import { Service } from "abstract/service";
import { QRCodeRepository } from "./qrcode.repository";
import type { QRCode, QRCodeInsert, QRCodeLookup } from "./qrcode.schema";

export class QRCodeService extends Service<QRCode, QRCodeInsert, QRCodeLookup, QRCodeRepository> {
  constructor(repo: QRCodeRepository = new QRCodeRepository()){
    super(repo)
  }
}
