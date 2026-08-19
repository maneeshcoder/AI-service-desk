"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api, setAccessToken } from "@/lib/axios";

interface User {
  id: string;
  name: string;
  email: string;
  role: "employee" | "support-engineer" | "admin";
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // on app load, try silently refreshing — if the httpOnly cookie is still
  // valid, this restores the session without asking the user to log in again
  useEffect(() => {
    async function restoreSession() {
      try {
        const { data } = await api.post("/auth/refresh");
        setAccessToken(data.accessToken);
        const me = await api.get("/auth/me"); // see note below
        setUser(me.data);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  async function login(email: string, password: string) {
    const { data } = await api.post("/auth/login", { email, password });
    setAccessToken(data.accessToken);
    setUser(data.user);
  }

  async function register(name: string, email: string, password: string) {
    await api.post("/auth/register", { name, email, password });
  }

  async function logout() {
    await api.post("/auth/logout");
    setAccessToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}