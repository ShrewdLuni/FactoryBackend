import { Controller } from "abstract/controller";
import { StorageEntryInsertSchema, type StorageEntry, type StorageEntryInsert } from "./storageEntry.schema";
import { StorageEntryService } from "./storageEntry.service";

export class StorageEntryController extends Controller<StorageEntry, StorageEntryInsert, StorageEntryService> {
  constructor(service: StorageEntryService = new StorageEntryService()) {
    super(service, StorageEntryInsertSchema);
  }
}
