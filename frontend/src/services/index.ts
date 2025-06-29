import http from "@/utils/http";

export const fetchTeacherOptions = async (inputValue: string) =>
  http.get(`/teachers?filter[name]=${inputValue}`).then((res) =>
    res.data.data.map((teacher: any) => {
      return {
        label: teacher.user_name,
        value: teacher.id,
      };
    })
  );
