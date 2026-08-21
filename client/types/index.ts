 export interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "support-engineer" | "admin";
}



export interface Ticket {
  _id: string;
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved" | "closed";
  priority: "low" | "medium" | "high" | "urgent";
  category?: string;
  createdBy: { _id: string; name: string; email: string } | string;
  assignedTo?: { _id: string; name: string; email: string } | string;
  createdAt: string;
}