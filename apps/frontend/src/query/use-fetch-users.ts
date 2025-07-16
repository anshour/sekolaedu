import { emptyPaginationResult, PaginationResult } from "@/types/pagination";
import http, { HttpError } from "@/utils/http";
import { handleMutationError } from "@/utils/new-error-handler";
import { objectToUrlParam } from "@/utils/var-transform";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";

export interface User {
  id: number;
  name: string;
  role_id: number | null;
  role_name: string | null;
  photo_url?: string | null;
  email: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  permissions?: string[];
}

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

export const useFetchUserById = (id: number | string) => {
  const query = useQuery({
    queryKey: ["users", id],
    queryFn: () => http.get(`/users/${id}`),
    enabled: !!id,
  });

  const user: User = useMemo(() => query.data?.data || null, [query.data]);

  return { user, ...query };
};

export const useLogoutUser = () => {
  return useMutation({
    mutationFn: () => http.post(`/auth/logout`),
    onError: (err) => {
      handleMutationError(err as HttpError);
    },
  });
};
