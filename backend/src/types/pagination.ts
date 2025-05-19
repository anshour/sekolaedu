import { z } from "zod";

export interface PaginationResult<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  limit: number;
}

export const paginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().default(15),
  filter: z.record(z.any()).optional(),
  sort: z.record(z.union([z.literal("asc"), z.literal("desc")])).optional(),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
