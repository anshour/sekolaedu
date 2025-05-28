export interface PaginationResult<T> {
  data: T[];
  total: number;
  current_page: number;
  last_page: number;
  limit: number;
}

export const emptyPaginationResult: PaginationResult<any> = {
  data: [],
  total: 0,
  current_page: 1,
  last_page: 1,
  limit: 10,
};
