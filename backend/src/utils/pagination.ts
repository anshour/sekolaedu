import type { Knex } from "knex";
import { PaginationParams, PaginationResult } from "~/types/pagination";

export async function paginate<T>(
  queryBuilder: Knex.QueryBuilder,
  params: PaginationParams,
  keyAlias = "id",
): Promise<PaginationResult<T>> {
  const { page, limit, filter, sort } = params;
  const offset = (page - 1) * limit;

  // Create a base query to be reused
  const baseQuery = queryBuilder.clone();

  // Apply filters if provided
  if (filter) {
    Object.entries(filter).forEach(([key, value]) => {
      baseQuery.where(key, value);
    });
  }

  // Execute count query and data query in parallel
  const [countResult, data] = await Promise.all([
    baseQuery
      .clone()
      .clear("select")
      .clear("order")
      .count(`${keyAlias} as count`)
      .first(),
    baseQuery
      .clone()
      .modify((qb) => {
        // Apply sorting if provided
        if (sort) {
          Object.entries(sort).forEach(([key, direction]) => {
            qb.orderBy(key, direction);
          });
        }
      })
      .limit(limit)
      .offset(offset),
  ]);

  const total = Number(countResult?.count || 0);

  return {
    data,
    total,
    limit,
    current_page: page,
    last_page: Math.ceil(total / limit),
  };
}
