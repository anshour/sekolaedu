import { queryKeys } from "@/constants/query-keys";
import { emptyPaginationResult, PaginationResult } from "@/types/pagination";
import http from "@/utils/http";
import { objectToUrlParam } from "@/utils/var-transform";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export const useFetchStudents = (params: Record<string, any> = {}) => {
  const query = useQuery({
    queryKey: queryKeys.student.list(params),
    queryFn: () => http.get(`/students?${objectToUrlParam(params)}`),
    placeholderData: keepPreviousData,
  });

  const students: PaginationResult<any> =
    query.data?.data || emptyPaginationResult;

  const isEmpty = (students?.data?.length || 0) === 0;

  return { students, isEmpty, ...query };
};
