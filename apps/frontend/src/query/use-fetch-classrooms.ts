import { keepPreviousData, useQuery } from "@tanstack/react-query";
import http from "@/utils/http";
import { useMemo } from "react";
import { queryKeys } from "@/constants/query-keys";

export const useFetchClassrooms = () => {
  const query = useQuery({
    queryKey: queryKeys.classroom.list,
    queryFn: () => http.get("/classrooms"),
    placeholderData: keepPreviousData,
  });

  const classrooms: any[] = useMemo(() => query.data?.data || [], [query.data]);

  const isEmpty = useMemo(() => {
    return classrooms.length === 0;
  }, [classrooms]);

  return { classrooms, isEmpty, ...query };
};
