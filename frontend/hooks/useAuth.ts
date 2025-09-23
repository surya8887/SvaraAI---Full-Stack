"use client";
import { useCallback, useEffect, useState } from "react";
import api from "@/lib/api";
import type { User } from "@/types";



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
        const storedUser = localStorage.getItem("user");
        const token = localStorage.getItem("token");
        if (token && storedUser) {
          api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          const res = await api.get("/auth/me");
          handleAuth(token, res.data.data.user);
        }
      } catch (err) {
        console.error("Failed to initialize auth:", err);
        logout();
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [handleAuth, logout]);

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const res = await api.post("/auth/login", { email, password });
        // console.log(res);
        
        handleAuth(res.data.data.accessToken, res.data.data.user);
        return res.data.user;
      } catch (err: any) {
        console.error("Login failed:", err.response?.data?.message || err.message);
        throw err;
      }
    },
    [handleAuth]
  );

  const signup = useCallback(
    async (payload: { username: string; email: string; password: string }) => {
      try {
        const res = await api.post("/auth/signup", payload);
        handleAuth(res.data.token, res.data.user);
        return res.data.user;
      } catch (err: any) {
        console.error("Signup failed:", err.response?.data?.message || err.message);
        throw err;
      }
    },
    [handleAuth]
  );

  return { user, loading, login, signup, logout };
}
