import { Repository } from "abstract/repository";
import { DeviceFromRow, type Device, type DeviceInsert, type DeviceLookup, type DeviceRow } from "./devices.schema";
import { query } from "db";

export class DeviceRepository extends Repository<Device, DeviceRow, DeviceLookup, DeviceInsert> {
  constructor() {
    super("devices", DeviceFromRow, { name: "name", capacity: "capacity", isActive: "is_active", department: { column: 'department_id', extract: (d) => d.department.id  } })
  }

  async findMany(): Promise<Device[]> {
    const result = await query<DeviceRow>(`SELECT 
      dev.*, 
      dep.label AS department_label
      FROM devices dev LEFT JOIN departments dep
      ON dev.department_id = dep.id
    `);
    return DeviceFromRow.array().parse(result.rows);
  }
}
