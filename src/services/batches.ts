import { query } from "db"

export const createBatch = async () => {

}

export const getBatch = async () => {

}

export const getAllBatches = async () => {
  const result = await query(`SELECT * FROM batches_api`)
  return result.rows;
}

export const updateBatch = async () => {

}

export const deleteBatch = async () => {

}
