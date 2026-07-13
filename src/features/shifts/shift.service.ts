import { Service } from "abstract/service";
import { ShiftRepository } from "./shift.repository";
import type { Shift, ShiftInsert, ShiftLookup } from "./shift.schema";
import { transaction } from "db";
import { BatchRepository } from "features/batches/batch.repository";

export class ShiftService extends Service<Shift, ShiftInsert, ShiftLookup, ShiftRepository> {
  private batchRepository: BatchRepository;
  constructor(repo: ShiftRepository = new ShiftRepository(), batchRepository: BatchRepository = new BatchRepository()) {
    super(repo);
    this.batchRepository = batchRepository;
  }

  async startShift(workerId: number, deviceId: number): Promise<Shift> {
    return transaction(async () => {
      const existing = await this.repository.findActiveByWorkerId(workerId);
      if (existing) 
        throw new Error(`Worker ${workerId} already has an open shift (session ${existing.id})`);
      return this.repository.create({ device: { id: deviceId }, worker: { id: workerId }});
    })
  }

  async endShift(workerId: number, deviceId?: number): Promise<Shift> {
    const actorBatchesInProgress = await this.batchRepository.findActiveByWorker(workerId);

    if (actorBatchesInProgress.length >= 1) {
      throw new Error(`Worker ${workerId} has active batches: ${actorBatchesInProgress.map(batch => batch.id)}`);
    }

    const ended = await this.repository.endSession(workerId);
    if (!ended) {
      throw new Error(`Worker ${workerId} has no open shift${deviceId ? ` on device ${deviceId}` : ""}`);
    }
    return ended;
  }

  async getCurrentShift(workerId: number): Promise<Shift | null> {
    return this.repository.findActiveByWorkerId(workerId);
  }
}
