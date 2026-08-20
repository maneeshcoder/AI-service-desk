 export interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "support-engineer" | "admin";
}