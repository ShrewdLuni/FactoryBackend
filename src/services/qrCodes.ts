import { query } from "db";
import type { InsertQRCode } from "schemas/qrcode";

export const createQRCodes = async (data: InsertQRCode, amount: number) => {
  const result = await query(`INSERT INTO qr_codes (name, resource) SELECT $1, $2 FROM generate_series(1, $3) RETURNING *`, [data.name ?? null, data.resource ?? null, amount])
  return result.rows;
};

export const getQRCodes = async () => {
  const result = await query(`SELECT * FROM qr_codes_api`);
  return result.rows;
};

