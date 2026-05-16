import { Service } from "abstract/service";
import { DefectTypeRepository } from "./defectType.repository";
import type { DefectType, DefectTypeInsert, DefectTypeLookup } from "./defectType.schema";

export class DefectTypeService extends Service<DefectType, DefectTypeInsert, DefectTypeLookup, DefectTypeRepository> {
  constructor(repo: DefectTypeRepository = new DefectTypeRepository()){
    super(repo)
  }
}
