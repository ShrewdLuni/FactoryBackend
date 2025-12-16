import { query } from "db"
import type { InsertBatch } from "schemas/batches";
import { buildBatchInsertQuery } from "utils/queries/batches";

export const createBatch = async (data: InsertBatch) => {
  const result = await query(`INSERT INTO batches (name, size, product_id) VALUES($1, $2, $3) RETURNING *`, [data.name ?? null, data.size, data.productId]);
  return result.rows[0];
};

export const createBatches = async (batch: InsertBatch, amount: number) => {
  const { assignments, values } = buildBatchInsertQuery(batch, amount)

  const result = await query(`INSERT INTO batches (name, size, product_id) VALUES ${assignments} RETURNING *`, values);
  console.log(result.rows)
  return result.rows;
};

export const getBatch = async () => {

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
