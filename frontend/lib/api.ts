import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

const api = axios.create({ baseURL, timeout: 10000 });

// Attach token automatically when stored in localStorage
api.interceptors.request.use((cfg) => {
  try {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      if (token && cfg.headers) {
        cfg.headers["Authorization"] = `Bearer ${token}`;
      }
    }
  } catch {
    // ignore (SSR)
  }
  return cfg;
});

export default api;
