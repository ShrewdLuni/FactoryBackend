import { getAllBatches } from "../services/batches"

export const getAllBatchesController = async () => {
  try {
    const data = await getAllBatches();
    return data;
  } catch (error) {
    console.log(error);
  }
}
