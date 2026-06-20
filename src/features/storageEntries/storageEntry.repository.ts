import { Repository } from "abstract/repository";
import { StorageEntryFromRow, type StorageEntry, type StorageEntryInsert, type StorageEntryLookup, type StorageEntryRow } from "./storageEntry.schema";

export class StorageEntryRepository extends Repository<StorageEntry, StorageEntryRow, StorageEntryLookup, StorageEntryInsert> {
  constructor() {
    super("storage_entries", StorageEntryFromRow, { product: { column: "product_id", extract: (d) => d.product.id }, boxSize: "box_size"})
  }
}
