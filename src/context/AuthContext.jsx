import { createContext, useContext, useEffect, useMemo, useState } from "react";

const AuthContext = createContext({
  user: null,
  token: null,
  login: () => {},
  logout: () => {},
  saveToken: () => {},
  removeToken: () => {},
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    if (storedToken) setToken(storedToken);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
      }
    }
  }, []);

  const saveToken = (newToken) => {
    if (!newToken) return;
    localStorage.setItem("token", newToken);
    setToken(newToken);
  };

  const removeToken = () => {
    localStorage.removeItem("token");
    setToken(null);
  };

  const login = ({ user: nextUser, token: nextToken }) => {
    if (nextUser) {
      setUser(nextUser);
      try {
        localStorage.setItem("user", JSON.stringify(nextUser));
      } catch {
      }
    }
    if (nextToken) saveToken(nextToken);
  };

  const logout = () => {
    setUser(null);
    try {
      localStorage.removeItem("user");
    } catch {
    }
    removeToken();
  };

  const value = useMemo(
    () => ({ user, token, login, logout, saveToken, removeToken }),
    [user, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
