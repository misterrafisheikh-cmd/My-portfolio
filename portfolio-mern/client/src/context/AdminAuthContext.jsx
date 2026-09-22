import { createContext, useContext, useState } from "react";

const AdminAuthContext = createContext(null);
const KEY = "rs-admin-token";

// Holds the admin's JWT in memory + localStorage. This is a lightweight
// personal-site login, not a full auth system — good enough for one
// admin, not meant to protect anything more sensitive than message list.
export function AdminAuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem(KEY) || "";
    } catch {
      return "";
    }
  });

  const login = (t) => {
    setToken(t);
    try { localStorage.setItem(KEY, t); } catch { /* ignore */ }
  };

  const logout = () => {
    setToken("");
    try { localStorage.removeItem(KEY); } catch { /* ignore */ }
  };

  return (
    <AdminAuthContext.Provider value={{ token, isAuthed: !!token, login, logout }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  return useContext(AdminAuthContext);
}
