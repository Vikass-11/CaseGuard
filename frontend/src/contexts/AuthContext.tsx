import { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User, LoginRequest, RegisterRequest } from "../types/auth";
import { authService } from "../services/authService";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginRequest) => {
    const response = await authService.login(credentials);
    
    localStorage.setItem("token", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.user));
    
    setToken(response.token);
    setUser(response.user);
  };

  const register = async (data: RegisterRequest) => {
    const response = await authService.register(data);
    
    localStorage.setItem("token", response.token);
    localStorage.setItem("refreshToken", response.refreshToken);
    localStorage.setItem("user", JSON.stringify(response.user));
    
    setToken(response.token);
    setUser(response.user);
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
    }
  };

  const refreshAuth = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (!refreshToken) {
      await logout();
      return;
    }

    try {
      const response = await authService.refreshToken({ refreshToken });
      
      localStorage.setItem("token", response.token);
      localStorage.setItem("refreshToken", response.refreshToken);
      
      setToken(response.token);
    } catch (error) {
      await logout();
    }
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
