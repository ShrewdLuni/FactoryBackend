import { Pool } from "pg"
import dotenv from "dotenv"
import type { QueryArrayConfig, QueryArrayResult, QueryConfig, QueryConfigValues, QueryResult, QueryResultRow, Submittable} from 'pg';

dotenv.config()

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: parseInt(process.env.DB_PORT || "5432", 10),
})

export function query<T extends Submittable>(queryStream: T): T;

export function query<R extends any[] = any[], I = any[]>(
  queryConfig: QueryArrayConfig<I>,
  values?: QueryConfigValues<I>,
): Promise<QueryArrayResult<R>>;

export function query<R extends QueryResultRow = any, I = any[]>(
  queryConfig: QueryConfig<I>,
): Promise<QueryResult<R>>;

export function query<R extends QueryResultRow = any, I = any[]>(
  queryTextOrConfig: string | QueryConfig<I>,
  values?: QueryConfigValues<I>,
): Promise<QueryResult<R>>;

export function query<R extends any[] = any[], I = any[]>(
  queryConfig: QueryArrayConfig<I>,
  callback: (err: Error, result: QueryArrayResult<R>) => void,
): void;

export function query<R extends QueryResultRow = any, I = any[]>(
  queryTextOrConfig: string | QueryConfig<I>,
  callback: (err: Error, result: QueryResult<R>) => void,
): void;

export function query<R extends QueryResultRow = any, I = any[]>(
  queryText: string,
  values: QueryConfigValues<I>,
  callback: (err: Error, result: QueryResult<R>) => void,
): void;

export function query(...args: any[]): any {
  // @ts-ignore — TypeScript already knows overloads; runtime doesn't need typing.
  return pool.query(...args);
}
