import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserCredentials } from "../types";
import api from '../api/client';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (credentials: UserCredentials) => Promise<void>;
  signup: (credentials: UserCredentials) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true); 

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await api.get('/user/check');
        setUser(data.user);
      } catch (error) {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const login = async (credentials: UserCredentials) => {
    const { data } = await api.post('/user/login', credentials);
    localStorage.setItem('token', data.data.token);
    setUser(data.data.user);
  };

  const signup = async (credentials: UserCredentials) => {
    const { data } = await api.post('/user/signup', credentials);
    localStorage.setItem('token', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);