import { CLIENT_URL } from "config";
import { InsertWorkstationSchema, WokrstationFromDatabase, WorkstationSchema } from "schemas/workstations";
import { qrcodeService } from "services/qrCodes";
import { workstationService } from "services/workstations";

export async function createAllWorkstations(): Promise<void> {
  const machineNames: string[] = [
    "Машина 1-3.5-132",
    "Машина 2-3.5-144",
    "Машина 3-3.5-156",
    "Машина 4-3.5-120",
    "Машина 5-3.75-156",
    "Машина 6-3.75-156",
    "Машина 7-3.75-156",
    "Машина 8-3.75-156",
    "Машина 9-3.75-156",
    "Машина 10-3.75-156",
    "Машина 11-3.75-156",
    "Машина 12-3.75-156",
    "Машина 13-3.75-156",
    "Машина 14-3.75-156",
    "Машина 15-3.75-156",
    "Машина 16-3.75-156",
    "Машина 17-3.75-156",
    "Машина 18-3.75-156",
    "Машина 19-3.75-144",
    "Машина 20-3.75-144",
    "Машина 21-3.75-144",
    "Машина 22-3.75-144",
    "Машина 23-3.75-144",
    "Машина 24-3.75-144",
    "Машина 25-3.75-144",
    "Машина 26-3.75-144",
    "Машина 27-3.75-144",
    "Машина 28-3.75-144",
    "Машина 29-3.75-144",
    "Машина 30-3.75-144",
    "Машина 31-3.75-144",
    "Машина 32-3.75-144",
    "Машина 33-3.75-144",
    "Машина 34-3.75-144",
    "Машина 35-3.75-144",
    "Машина 36-3.75-180",
  ];


  for (const name of machineNames) {
    const qr = await qrcodeService.create({ name });

    const data = InsertWorkstationSchema.parse({
      name,
      qrCode: qr.id,
    });

    const result = await workstationService.create(data);
    const workstation = WokrstationFromDatabase.parse(result);

    await qrcodeService.activate(qr.id, `${CLIENT_URL}/workstations/${workstation.id}`);
  }
}
