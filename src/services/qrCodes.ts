import { query } from "db";
import type { DatabaseQRCode, InsertQRCode } from "schemas/qrcode";

export const createQRCodes = async (data: InsertQRCode, amount: number): Promise<DatabaseQRCode[]> => {
  const result = await query(`INSERT INTO qr_codes (name, resource) SELECT $1, $2 FROM generate_series(1, $3) RETURNING *`, [data.name ?? null, data.resource ?? null, amount])
  return result.rows;
};

export const getQRCodes = async (): Promise<DatabaseQRCode[]> => {
  const result = await query(`SELECT * FROM qr_codes`);
  return result.rows;
};

export const getQRCodeById = async (id: number): Promise<DatabaseQRCode[]> => {
  const result = await query(`SELECT * FROM qr_codes WHERE id = $1`, [id]);
  return result.rows[0];
}

export const activateQRCode = async (id: number, resource: string): Promise<DatabaseQRCode[]> => {
  const result = await query(`UPDATE qr_codes SET resource = $1 WHERE id = $2 RETURNING *`, [resource, id])
  return result.rows[0];
}
