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

export const useFetchClassroomDetail = (id: number | string) => {
  const query = useQuery({
    queryKey: queryKeys.classroom.detail(id),
    queryFn: () => http.get(`/classrooms/${id}`),
    placeholderData: keepPreviousData,
    enabled: !!id,
  });

  const classroom: any = query.data?.data?.classroom || {};
  const students: any[] = query.data?.data?.students || [];

  return { classroom, students, ...query };
};
