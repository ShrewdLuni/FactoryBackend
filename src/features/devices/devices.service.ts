import { Service } from "abstract/service";
import { DeviceRepository } from "./devices.repository";
import type { Device, DeviceInsert, DeviceLookup } from "./devices.schema";

export class DeviceService extends Service<Device, DeviceInsert, DeviceLookup, DeviceRepository> {
  constructor(repo: DeviceRepository = new DeviceRepository()){
    super(repo)
  }
}
