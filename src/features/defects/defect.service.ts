import { Service } from "abstract/service";
import { DefectRepository } from "./defect.repository";
import type { Defect, DefectInsert, DefectLookup } from "./defect.schema";

export class DefectService extends Service<Defect, DefectInsert, DefectLookup, DefectRepository> {
  constructor(repo: DefectRepository = new DefectRepository()){
    super(repo)
  }
}
