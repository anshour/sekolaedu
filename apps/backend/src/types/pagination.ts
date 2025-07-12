import { z } from "zod/v4";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  limit: number;
}

export const createPaginationSchema = <
  TFilterKeys extends string,
  TSortKeys extends string,
>(options: {
  allowedFilters: TFilterKeys[];
  allowedSorts: TSortKeys[];
}) => {
  return z.object({
    page: z.coerce.number().positive().default(1),
    limit: z.coerce.number().int().positive().default(15),
    filter: z
      .record(z.string(), z.any())
      .refine(
        (filterObj) => {
          const filterKeys = Object.keys(filterObj);
          return filterKeys.every((key) =>
            options.allowedFilters.includes(key as TFilterKeys),
          );
        },
        {
          message: `Filter key must be one of: ${options.allowedFilters.join(", ")}`,
        },
      )
      .optional(),
    sort: z
      .record(z.string(), z.enum(["asc", "desc"]))
      .refine(
        (sortObj) => {
          const sortKeys = Object.keys(sortObj);
          return sortKeys.every((key) =>
            options.allowedSorts.includes(key as TSortKeys),
          );
        },
        {
          message: `Sort key must be one of: ${options.allowedSorts.join(", ")}`,
        },
      )
      .optional(),
  });
};

export const paginationSchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().int().positive().default(15),
  filter: z.record(z.string(), z.any()).optional(),
  sort: z.record(z.string(), z.enum(["asc", "desc"])).optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
