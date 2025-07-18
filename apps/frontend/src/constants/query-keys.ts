export const queryKeys = {
  classroom: {
    list: ["classrooms"],
    detail: (id: number) => ["classrooms", id],
  },

  student: {
    list: (filter: Record<string, any>) => ["students", filter],
  },
};
