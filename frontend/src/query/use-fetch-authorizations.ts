import { emptyPaginationResult, PaginationResult } from "@/types/pagination";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
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

export const useFetchPermissions = () => {
  const query = useQuery({
    queryKey: ["permissions"],
    queryFn: () => http.get("/permissions"),
    placeholderData: keepPreviousData,
  });

  const permissions: PaginationResult<any> = useMemo(
    () => query.data?.data || emptyPaginationResult,
    [query.data]
  );

  const isEmpty = useMemo(() => {
    return (permissions?.data?.length || 0) === 0;
  }, [permissions.data.length]);

  return { permissions, isEmpty, ...query };
};

export const useFetchRoleById = (roleId: string) => {
  const query = useQuery({
    queryKey: ["role-detail", roleId],
    queryFn: () => http.get(`/roles/${roleId}`),
    placeholderData: keepPreviousData,
    enabled: !!roleId,
  });

  const role: any = useMemo(() => query.data?.data, [query.data]);

  const isEmpty = useMemo(() => {
    return !role || Object.keys(role).length === 0;
  }, [role]);

  return { role, isEmpty, ...query };
};
