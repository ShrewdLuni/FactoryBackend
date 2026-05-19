import { Controller } from "abstract/controller";
import { DeviceInsertSchema, type Device, type DeviceInsert } from "./devices.schema";
import { DeviceService } from "./devices.service";

export class DeviceController extends Controller<Device, DeviceInsert, DeviceService> {
  constructor(service: DeviceService = new DeviceService()) {
    super(service, DeviceInsertSchema);
  }
}
