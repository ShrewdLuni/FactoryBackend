import { query } from "db"
import type { InsertBatch } from "schemas/batches";
import { buildBatchInsertQuery } from "utils/queries/batches";

export const createBatch = async (data: InsertBatch) => {
  const result = await query(`INSERT INTO batches (name, size, product_id) VALUES($1, $2, $3) RETURNING *`, [data.name ?? null, data.size, data.productId]);
  return result.rows[0];
};

export const createBatches = async (batch: InsertBatch, amount: number) => {
  const { assignments, values } = buildBatchInsertQuery(batch, amount)

  const result = await query(`INSERT INTO batches (name, size, product_id, assigned_master_id, planned_for) VALUES ${assignments} RETURNING *`, values);
  console.log(result.rows)
  return result.rows;
};

export const scanBatch = async (id: number) => {
  try {
    const result = await query(`SELECT advance_batch_progress($1) as new_status`, [id]);

    if (result.rows.length === 0) {
      throw new Error('Batch not found')
    }

    return result.rows[0];
  } catch (error) {
    throw error;
  }
}

export const getBatch = async (id: number) => {
  const result = await query(`SELECT * FROM batches_api WHERE id = $1`, [id])
  return result.rows[0];
}

export const getAllBatches = async () => {
  const result = await query(`SELECT * FROM batches_api`)
  return result.rows;
}

export const getAllBatchesWithProducts = async () => {
  const result = await query(`SELECT * FROM batches_with_product_api`);
  return result.rows;
}

export const updateBatch = async () => {

}

export const deleteBatch = async () => {

}
