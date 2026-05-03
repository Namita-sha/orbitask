import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('orbitask_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('orbitask_token'));
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    const res = await API.post('/auth/login', { email, password });
    const { user, token } = res.data;
    localStorage.setItem('orbitask_token', token);
    localStorage.setItem('orbitask_user', JSON.stringify(user));
    setUser(user);
    setToken(token);
    return user;
  };

  const signup = async (name, email, password, role) => {
    const res = await API.post('/auth/signup', { name, email, password, role });
    const { user, token } = res.data;
    localStorage.setItem('orbitask_token', token);
    localStorage.setItem('orbitask_user', JSON.stringify(user));
    setUser(user);
    setToken(token);
    return user;
  };

  const logout = () => {
    localStorage.removeItem('orbitask_token');
    localStorage.removeItem('orbitask_user');
    setUser(null);
    setToken(null);
  };

  const isAdmin = user?.role === 'Admin';

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAdmin, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};