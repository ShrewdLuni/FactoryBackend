import { Service } from "abstract/service";
import { BatchRepository } from "./batch.repository";
import type { Batch, BatchInsert, BatchLookup } from "./batch.schema";
import { StatusTransitionRepository } from "features/statusTransitions/statusTransition.repository";
import { UserRepository } from "features/users/user.repository";
import { transaction } from "db";
import { DefectRepository } from "features/defects/defect.repository";
import { DeviceRepository } from "features/devices/devices.repository";
import { BatchTransitionRepository } from "features/batchTransitions/batchTransitions.repository";
import type { BatchTransitionInsert } from "features/batchTransitions/batchTransitions.schema";
import { ProductRepository } from "features/products/product.repository";

export class BatchService extends Service<Batch, BatchInsert, BatchLookup, BatchRepository> {
  private statusTransitionRepository: StatusTransitionRepository;
  private userRepository: UserRepository;
  private defectRepository: DefectRepository;
  private deviceRepository: DeviceRepository;
  private batchTransitionsRepository: BatchTransitionRepository;
  private productRepository: ProductRepository;

  constructor(
    repo: BatchRepository = new BatchRepository(),
    statusTransitionRepository: StatusTransitionRepository = new StatusTransitionRepository(),
    userRepository: UserRepository = new UserRepository(),
    defectRepository: DefectRepository = new DefectRepository(),
    deviceRepository: DeviceRepository = new DeviceRepository(),
    batchTransitionRepository: BatchTransitionRepository = new BatchTransitionRepository(),
    productRepository: ProductRepository = new ProductRepository()
  ) {
    super(repo);
    this.statusTransitionRepository = statusTransitionRepository;
    this.userRepository = userRepository;
    this.defectRepository = defectRepository;
    this.deviceRepository = deviceRepository;
    this.batchTransitionsRepository = batchTransitionRepository;
    this.productRepository = productRepository;
  }

  async findManyWithAll(): Promise<Batch[]> {
    const result = await this.repository.findManyWithAll();
    console.log(result[150]?.transitions)
    return result;
  }
  }
}
