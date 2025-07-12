export const ROLES = {
  ADMIN: "admin",
  PRINCIPAL: "principal",
  TEACHER: "teacher",
  STUDENT: "student",
} as const;

export const DASHBOARD_ROUTES: Record<string, any> = {
  [ROLES.ADMIN]: "/dashboard/admin",
  [ROLES.PRINCIPAL]: "/dashboard/principal",
  [ROLES.TEACHER]: "/dashboard/teacher",
  [ROLES.STUDENT]: "/dashboard/student",
};
