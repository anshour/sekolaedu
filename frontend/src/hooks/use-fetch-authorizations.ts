import { emptyPaginationResult, PaginationResult } from "@/types/pagination";
import http from "@/utils/http";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export const useFetchRoles = () => {
  const query = useQuery({
    queryKey: ["roles"],
    queryFn: () => http.get("/roles"),
    placeholderData: keepPreviousData,
  });

  const roles: PaginationResult<any> = useMemo(
    () => query.data?.data || emptyPaginationResult,
    [query.data]
  );

  const isEmpty = useMemo(() => {
    return (roles?.data?.length || 0) === 0;
  }, [roles.data.length]);

  return { roles, isEmpty, ...query };
};
