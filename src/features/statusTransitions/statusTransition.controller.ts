import { Controller } from "abstract/controller";
import { StatusTransitionInsertSchema, type StatusTransition, type StatusTransitionInsert } from "./statusTransition.schema";
import { StatusTransitionService } from "./statusTransition.service";

export class StatusTransitionController extends Controller<StatusTransition, StatusTransitionInsert, StatusTransitionService> {
  constructor(service: StatusTransitionService = new StatusTransitionService()) {
    super(service, StatusTransitionInsertSchema);
  }
}
