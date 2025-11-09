export type Role = "teacher" | "student" | "parent" | "assistant" | "admin";

export interface RoleRoute {
  path: string;
  label: string;
}

export interface RoleRoutes {
  teacher: RoleRoute[];
  student: RoleRoute[];
  parent: RoleRoute[];
  assistant: RoleRoute[];
  admin: RoleRoute[];
}

