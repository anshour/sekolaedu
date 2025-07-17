export const queryKeys = {
  classroom: {
    list: ["classrooms"],
    detail: (id: number | string) => ["classrooms", id],
  },
};
