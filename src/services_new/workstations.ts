import type { WorkstationRepository } from "repositories/workstations";

export class WorkstationService {

  constructor (private workstationRepository: WorkstationRepository) {}

  async find(id: number) {
    const workstation = this.workstationRepository.find(id);
    return workstation;
  }

  async findMany() {
    const workstations = this.workstationRepository.findMany();
    return workstations;
  }
}

