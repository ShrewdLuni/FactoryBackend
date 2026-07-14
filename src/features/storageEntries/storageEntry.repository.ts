import { Repository } from "abstract/repository";
import { StorageEntryFromRow, type StorageEntry, type StorageEntryInsert, type StorageEntryLookup, type StorageEntryRow } from "./storageEntry.schema";
import { query } from "db";

export class StorageEntryRepository extends Repository<StorageEntry, StorageEntryRow, StorageEntryLookup, StorageEntryInsert> {
  constructor() {
    super("storage_entries", StorageEntryFromRow, 
      { 
        product: { column: "product_id", extract: (d) => d.product.id }, 
        boxSize: "box_size",
        writtenOffAt: "written_off_at",
      })
  }

  async findMany(): Promise<StorageEntry[]> {
    const result = await query<StorageEntryRow>(`SELECT 
      se.*, p.name as product_name FROM storage_entries se 
      LEFT JOIN products p ON se.product_id = p.id;
    `);
    return StorageEntryFromRow.array().parse(result.rows);
  }
}
