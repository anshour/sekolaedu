import { emptyPaginationResult, PaginationResult } from "@/types/pagination";
import http from "@/utils/http";
import { objectToUrlParam } from "@/utils/var-transform";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFetchUser = (params: Record<string, any>) => {
  const query = useQuery({
    queryKey: ["users", params],
    queryFn: () => http.get(`/users?${objectToUrlParam(params)}`),
    placeholderData: keepPreviousData,
  });

  const users: PaginationResult<any> = useMemo(
    () => query.data?.data || emptyPaginationResult,
    [query.data]
  );

  const isEmpty = useMemo(() => {
    return (users?.data?.length || 0) === 0;
  }, [users.data.length]);

  return { users, isEmpty, ...query };
};
