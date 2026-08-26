import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/axios";

interface Engineer {
  _id: string;
  name: string;
}

export function useAssignableEngineers() {
  return useQuery<Engineer[]>({
    queryKey: ["engineers"],
    queryFn: async () => {
      const { data } = await api.get("/users");
      return data.filter((u: any) => u.role === "support-engineer");
    },
    staleTime: 5 * 60 * 1000, // engineer list rarely changes — 5 min cache is fine
  });
}