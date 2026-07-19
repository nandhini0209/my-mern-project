import { createContext, useContext, useEffect, useState } from 'react';
import { mockApi } from '../services/mockApi';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      mockApi.getProfile(token)
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem('token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  async function login(credentials) {
    const { token: newToken, user: u } = await mockApi.login(credentials);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(u);
    return u;
  }

  async function register(data) {
    const { token: newToken, user: u } = await mockApi.register(data);
    localStorage.setItem('token', newToken);
    setToken(newToken);
    setUser(u);
    return u;
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = { user, token, loading, login, register, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
