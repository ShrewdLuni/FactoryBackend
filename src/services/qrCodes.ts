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

export const getQRCode = async (id: number) => {
  const result = await query(`SELECT * FROM qr_codes_api WHERE id = $1`, [id]);
  return result.rows[0];
}

export const activateQRCode = async (id: number, resource: string) => {
  const result = await query(`UPDATE qr_codes SET resource = $1 WHERE id = $2 RETURNING *`, [resource, id])
  return result.rows[0];
}
