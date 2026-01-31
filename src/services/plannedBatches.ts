import type { DatabaseWorkstation, InsertWorkstation } from "schemas/workstations"
import { query } from "../db"
import type { DatabasePlannedBatch, InsertPlannedBatch } from "schemas/plannedBatches";

export const getAllPlannedBatches = async (): Promise<DatabasePlannedBatch[]> => {
  const result = await query("SELECT * FROM planned_batches");
  return result.rows
}

export const getPlannedBatch = async (id: number): Promise<DatabasePlannedBatch> => {
  const result = await query("SELECT * FROM planned_batches WHERE id = $1", [id]);
  return result.rows[0];
}

export const createPlannedBatch= async (data: InsertPlannedBatch): Promise<DatabasePlannedBatch> => {
  const result = await query(`INSERT INTO planned_bathces (
    product_id, 
    size,
    knitting_worker_id,
    sewing_worker_id,
    molding_worker_id,
    labeling_worker_id,
    packaging_worker_id,
    workstation_id)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [
      data.productId,
      data.size,
      data.masters.knitting,
      data.masters.sewing,
      data.masters.molding,
      data.masters.labeling,
      data.masters.packaging,
      data.workstationId
    ]);
  return result.rows[0];
}


export const updatePlannedBatch = async (id: number, data: InsertPlannedBatch): Promise<DatabasePlannedBatch> => {
  const result = await query(`UPDATE workstations SET 
    product_id = $2, 
    size = $3,
    knitting_worker_id = $4,
    sewing_worker_id = $5,
    molding_worker_id = $6,
    labeling_worker_id = $7,
    packaging_worker_id + $8,
    workstation_id = $9
    WHERE id = 1
    RETURNING *`,
    [
      id,
      data.productId,
      data.size,
      data.masters.knitting,
      data.masters.sewing,
      data.masters.molding,
      data.masters.labeling,
      data.masters.packaging,
      data.workstationId
    ]);
  return result.rows[0];
}

export const deletePlannedBatch = async (id: number): Promise<DatabasePlannedBatch> => {
  const result = await query("DELETE FROM planned_batches WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
}


