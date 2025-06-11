import { count, SQL, Table } from "drizzle-orm";
import db from "../database/connection";
import { PaginationParams, PaginationResult } from "~/types/pagination";

type PaginateOptions<T> = {
  table: Table;
  where?: (table: any) => SQL<unknown> | undefined;
  with?: any;
  orderBy?: (table: any) => any;
};

export async function paginate<T>(
  params: PaginationParams,
  options: PaginateOptions<T>,
): Promise<PaginationResult<T>> {
  const page = params.page || 1;
  const limit = params.limit || 15;
  const offset = (page - 1) * limit;

  // Count total
  const total = await db
    .select({ count: count(), ...options.table })
    .from(options.table)
    .groupBy(options.table.id)
    .where(options.where)
    .then((result) => Number(result[0]?.count) || 0);

  // Infer tableName from table object
  const tableName = options.table[Symbol.for("drizzle:BaseName")] as string;

  // Fetch paginated data
  const data = await db.query[tableName].findMany({
    where: options.where,
    with: options.with,
    orderBy: options.orderBy,
    limit,
    offset,
  });

  const last_page = Math.ceil(total / limit);

  return {
    data,
    total,
    current_page: page,
    last_page,
    limit,
  };
}
