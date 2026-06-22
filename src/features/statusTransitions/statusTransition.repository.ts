import { Repository } from "abstract/repository";
import {
  StatusTransitionFromRow,
  type StatusTransition,
  type StatusTransitionInsert,
  type StatusTransitionLookup,
  type StatusTransitionRow,
} from "./statusTransition.schema";

export class StatusTransitionRepository extends Repository<
  StatusTransition,
  StatusTransitionRow,
  StatusTransitionLookup,
  StatusTransitionInsert
> {
  constructor() {
    super("status_transitions", StatusTransitionFromRow, {
      fromStatus: { column: "from_status_id", extract: (d) => d.fromStatus.id } ,
      toStatus: { column: "to_status_id", extract: (d) => d.toStatus.id } ,
      requiredDepartment: { column: "required_department_id", extract: (d) => d.requiredDepartment?.id } ,
      requiredRole: { column: "required_role_id", extract: (d) => d.requiredRole?.id} ,
    },
    {
      id: "id",
      fromStatus: { column: "from_status_id", extract: (v) => (v as { id: number }).id },
      toStatus: { column: "to_status_id", extract: (v) => (v as { id: number }).id },
    });
  }
}
