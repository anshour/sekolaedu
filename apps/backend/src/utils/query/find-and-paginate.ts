import { Model, FindAndCountOptions, ModelStatic } from "sequelize";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  limit: number;
}

interface PaginationParams {
  page: number;
  limit: number;
}

export class PaginationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PaginationError";
  }
}

/**
 * Fungsi paginate untuk Sequelize models
 * @param ModelClass - Sequelize Model class
 * @param page - Nomor halaman (dimulai dari 1)
 * @param limit - Jumlah item per halaman
 * @param findOptions - Sequelize find options (where, include, order, dll)
 * @returns Promise<PaginationResult<T>>
 */

export interface FindAndPaginateProps
  extends Omit<FindAndCountOptions, "offset"> {
  page: number;
}

export async function findAndPaginate<T extends Model>(
  ModelClass: ModelStatic<T>,
  options: FindAndPaginateProps,
): Promise<PaginationResult<T>> {
  const { page, limit = 15, ...findOptions } = options;
  try {
    validatePaginationParams({ page, limit });

    const offset = (page - 1) * limit;

    const options: FindAndCountOptions = {
      ...findOptions,
      limit,
      offset,
    };

    const result = await ModelClass.findAndCountAll(options);

    const lastPage = Math.ceil(result.count / limit);

    return {
      data: result.rows as T[],
      total: result.count,
      current_page: page,
      last_page: lastPage,
      limit,
    };
  } catch (error) {
    if (error instanceof PaginationError) {
      throw error;
    }
    throw new PaginationError(
      `Pagination failed: ${error instanceof Error ? error.message : "Unknown error"}`,
    );
  }
}

/**
 * Validasi parameter pagination
 * @param params - Parameter pagination
 */
function validatePaginationParams(params: PaginationParams): void {
  const { page, limit } = params;

  if (!Number.isInteger(page) || page < 1) {
    throw new PaginationError(
      "Page must be a positive integer starting from 1",
    );
  }

  if (!Number.isInteger(limit) || limit < 1) {
    throw new PaginationError("Limit must be a positive integer");
  }

  if (limit > 1000) {
    throw new PaginationError("Limit cannot exceed 1000 items per page");
  }
}
