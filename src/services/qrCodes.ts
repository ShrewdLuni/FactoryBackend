import { query } from "db";
import type { DatabaseQRCode, InsertQRCode } from "schemas/qrcode";

export const getQRCodes = async (): Promise<DatabaseQRCode[]> => {
  const result = await query(`SELECT * FROM qr_codes`);
  return result.rows;
};

export const getQRCode = async (id: number): Promise<DatabaseQRCode[]> => {
  const result = await query(`SELECT * FROM qr_codes WHERE id = $1`, [id]);
  return result.rows[0];
}

export const createQRCodes = async (data: InsertQRCode, amount: number): Promise<DatabaseQRCode[]> => {
  const result = await query(`INSERT INTO qr_codes (name, resource) SELECT $1, $2 FROM generate_series(1, $3) RETURNING *`, [data.name, data.resource, amount])
  return result.rows;
};

export const updateQRCode = async (id: number, data: InsertQRCode): Promise<DatabaseQRCode> => {
  const result = await query(`UPDATE qr_codes SET name = $2, resource = $3 WHERE id = $1 RETURNING *`, [id, data.name, data.resource])
  return result.rows[0];
}

export const deleteQRCode = async (id: number): Promise<DatabaseQRCode[]> => {
  const result = await query(`DELETE FROM qr_codes WHERE id = $1`, [id]);
  return result.rows[0];
}

export const activateQRCode = async (id: number, resource: string): Promise<DatabaseQRCode[]> => {
  const result = await query(`UPDATE qr_codes SET resource = $1 WHERE id = $2 RETURNING *`, [resource, id])
  return result.rows[0];
}
