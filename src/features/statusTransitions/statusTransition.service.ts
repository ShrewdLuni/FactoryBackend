import { Service } from "abstract/service";
import { StatusTransitionRepository } from "./statusTransition.repository";
import type { StatusTransition, StatusTransitionInsert, StatusTransitionLookup } from "./statusTransition.schema";

export class StatusTransitionService extends Service<StatusTransition, StatusTransitionInsert, StatusTransitionLookup, StatusTransitionRepository> {
  constructor(repo: StatusTransitionRepository = new StatusTransitionRepository()){
    super(repo)
  }
}
