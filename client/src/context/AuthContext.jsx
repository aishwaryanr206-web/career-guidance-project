import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("career_user")) || null; } catch { return null; }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("career_token");
    if (!token) { setLoading(false); return; }
    api.get("/auth/me")
      .then(res => setUser(res.data))
      .catch(() => logout())
      .finally(() => setLoading(false));
  }, []);

  function saveAuth(data) {
    localStorage.setItem("career_token", data.token);
    localStorage.setItem("career_user", JSON.stringify(data.user));
    setUser(data.user);
  }

  function logout() {
    localStorage.removeItem("career_token");
    localStorage.removeItem("career_user");
    setUser(null);
  }

  return <AuthContext.Provider value={{ user, loading, saveAuth, logout }}>
    {children}
  </AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
