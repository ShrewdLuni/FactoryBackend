import { Service } from "abstract/service";
import { StorageEntryRepository } from "./storageEntry.repository";
import type { StorageEntry, StorageEntryInsert, StorageEntryLookup } from "./storageEntry.schema";

export class StorageEntryService extends Service<StorageEntry, StorageEntryInsert, StorageEntryLookup, StorageEntryRepository> {
  constructor(repo: StorageEntryRepository = new StorageEntryRepository()){
    super(repo)
  }
}
