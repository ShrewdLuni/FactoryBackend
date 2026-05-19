import { Repository } from "abstract/repository";
import { DeviceFromRow, type Device, type DeviceInsert, type DeviceLookup, type DeviceRow } from "./devices.schema";

export class DeviceRepository extends Repository<Device, DeviceRow, DeviceLookup, DeviceInsert> {
  constructor() {
    super("devices", DeviceFromRow, { name: "name", capacity: "capacity", isActive: "is_active", department: { column: 'department_id', extract: (d) => d.department.id  } })
  }
}
