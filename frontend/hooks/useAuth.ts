// hooks/useAuth.ts
"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { User } from "@/types";
interface AuthResponse {
  token: string;
  user: User;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuth = useCallback((token: string, user: User) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const raw = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (token && raw) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          // optional token validation
          const res = await api.get<{ user: User }>("/auth/me");
          handleAuth(token, res.data.user);
        }
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [handleAuth, logout]);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.post<AuthResponse>("/auth/login", { email, password });
    handleAuth(res.data.token, res.data.user);
    return res.data.user;
  }, [handleAuth]);

  const signup = useCallback(async (payload: { username: string; email: string; password: string }) => {
    const res = await api.post<AuthResponse>("/auth/signup", payload);
    handleAuth(res.data.token, res.data.user);
    return res.data.user;
  }, [handleAuth]);

  return { user, loading, login, signup, logout };
}
