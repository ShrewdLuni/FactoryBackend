import fs from "fs";
import path from "path";
import { pool } from "./db";
import type { QueryResult } from "pg";

interface MigrationRow {
  name: string;
}

const MIGRATIONS_DIR = path.join(__dirname, "migrations");

export const migrate = async (): Promise<void> => {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS migrations (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL UNIQUE,
        applied_at TIMESTAMP DEFAULT NOW()
      );
    `);

    const result: QueryResult<MigrationRow> = await client.query("SELECT name FROM migrations");
    const appliedMigrations = result.rows.map((r) => r.name);

    const files: string[] = fs.readdirSync(MIGRATIONS_DIR).filter((f) => f.endsWith(".up.sql")).sort();

    for (const file of files) {
      if (!appliedMigrations.includes(file)) {
        const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), "utf-8");
        await client.query(sql);
        await client.query("INSERT INTO migrations (name) VALUES ($1)", [file]);
        console.log(`Applied migration: ${file}`);
      }
    }

    console.log("All migrations applied successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    client.release();
  }
};

export const rollback = async (count: number = 1): Promise<void> => {
  const client = await pool.connect();
  try {
    const res: QueryResult<MigrationRow> = await client.query("SELECT name FROM migrations ORDER BY applied_at DESC LIMIT $1", [count]);

    if (res.rows.length === 0) {
      console.log("No migrations to rollback");
      return;
    }

    for (const row of res.rows) {
      const migrationName = row.name;
      const downFile = migrationName.replace(".up.sql", ".down.sql");
      const downPath = path.join(MIGRATIONS_DIR, downFile);

      if (!fs.existsSync(downPath)) {
        console.log(`No rollback file found for ${migrationName}, skipping`);
        continue;
      }

      const sql = fs.readFileSync(downPath, "utf-8");
      await client.query(sql);
      await client.query("DELETE FROM migrations WHERE name = $1", [migrationName]);
      console.log(`Rolled back migration: ${migrationName}`);
    }
  } catch (error) {
    console.error("Rollback failed:", error);
  } finally {
    client.release();
  }
};
