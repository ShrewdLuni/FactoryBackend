import { query } from "db";
import type { DatabaseBatch, DatabaseBatchWithProduct, InsertBatch } from "schemas/batches";
import { buildBatchInsertQuery } from "utils/queries/batches";

export const getBatches = async (): Promise<DatabaseBatch[]> => {
  const result = await query(`SELECT * FROM batches`);
  return result.rows;
};

export const getBatch = async (id: number): Promise<DatabaseBatch> => {
  const result = await query(`SELECT * FROM batches WHERE id = $1`, [id]);
  return result.rows[0];
};

export const getBatchesWithProducts = async (): Promise<DatabaseBatchWithProduct[]> => {
  const result = await query(`SELECT b.*, p.code, p.category, p.name, p.is_active, p.measure_unit FROM batches b JOIN products P`);
  return result.rows;
};

export const deleteBatch = async (id: number): Promise<DatabaseBatch> => {
  const result = await query("DELETE FROM batches WHERE id = $1 RETURNING *", [id]);
  return result.rows[0];
};

export const createBatch = async (data: InsertBatch): Promise<DatabaseBatch> => {
  const result = await query(
    `INSERT INTO batches 
  (
      name, 
      size, 
      product_id,
      knitting_worker_id,
      sewing_worker_id,
      molding_worker_id,
      labeling_worker_id,
      packaging_worker_id,
      workstation_id,
      is_planned,
      planend_for
    ) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *`,
    [
      data.name,
      data.size,
      data.productId,
      data.masters.knitting,
      data.masters.sewing,
      data.masters.molding,
      data.masters.labeling,
      data.masters.packaging,
      data.workstationId,
      data.isPlanned,
      data.plannedFor,
    ],
  );
  return result.rows[0];
};

export const updateBatch = async (id: number, data: InsertBatch) => {
  const result = await query(
    `UPDATE batches  SET
      name = $2, 
      size = $3, 
      product_id = $4,
      knitting_worker_id = $5,
      sewing_worker_id = $6,
      molding_worker_id = $7,
      labeling_worker_id = $8,
      packaging_worker_id = $9,
      workstation_id = $10,
      is_planned = $11,
      planned_for = $12
    WHERE id = $1
    RETURNING *`,
    [
      id,
      data.name,
      data.size,
      data.productId,
      data.masters.knitting,
      data.masters.sewing,
      data.masters.molding,
      data.masters.labeling,
      data.masters.packaging,
      data.workstationId,
      data.isPlanned,
      data.plannedFor,
    ],
  );
  return result.rows[0];
};

export const scanBatch = async (id: number): Promise<DatabaseBatch> => {
  const result = await query(`SELECT advance_batch_progress($1) as new_status`,[id],);
  return result.rows[0];
};

export const createBatches = async (batch: InsertBatch, amount: number): Promise<DatabaseBatch[]> => {
  const { assignments, values } = buildBatchInsertQuery(batch, amount);
  const result = await query(`INSERT INTO batches (name, size, product_id, assigned_master_id, planned_for) VALUES ${assignments} RETURNING *`, values);
  return result.rows;
};

export const initializePlannedBatches = async (): Promise<DatabaseBatch[]> => {
  const result = await query(`INSERT INTO batches (workstation_id, is_planned)
    SELECT w.id, true
    FROM workstations w
    WHERE NOT EXISTS (
      SELECT 1 FROM batches WHERE is_planned = true
    )
    RETURNING *
  `);

  return result.rows;
};

export const executePlannedBatches = async (): Promise<DatabaseBatch[]> => {
  const result = await query(`UPDATE batches SET is_planned = false WHERE is_planned = true RETURNING *`,);
  return result.rows;
};

export const batchesService = {
  getAll: getBatches,
  get: getBatch,
  create: createBatch,
  update: updateBatch,
  delete: deleteBatch,

  getAllWithProducts: getBatchesWithProducts,
  scan: scanBatch,
  createMultiple: createBatches,
  initializePlanned: initializePlannedBatches,
  executePlanned: executePlannedBatches,
};
