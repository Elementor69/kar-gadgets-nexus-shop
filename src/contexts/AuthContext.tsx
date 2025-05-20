
import React, { createContext, useContext, useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role?: "user" | "admin"; // Add role for admin differentiation
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Check for stored user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAdmin(parsedUser.role === "admin");
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Mock login - would be an actual API call in a real app with Supabase
      let mockUser;
      
      // Check if this is an admin login
      if (email === "admin@example.com" && password === "admin123") {
        mockUser = {
          id: "admin-1",
          name: "Admin User",
          email: email,
          avatar: "https://i.pravatar.cc/150?u=admin",
          role: "admin" as "admin" // Explicitly specify this is the "admin" literal type
        };
        setIsAdmin(true);
      } else {
        mockUser = {
          id: "user-1",
          name: "John Doe",
          email: email,
          avatar: "https://i.pravatar.cc/150?u=john",
          role: "user" as "user" // Explicitly specify this is the "user" literal type
        };
        setIsAdmin(false);
      }
      
      // Save user to local storage
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      // Mock Google login - would be an actual OAuth flow in a real app
      const mockUser = {
        id: "google-user-1",
        name: "Google User",
        email: "google.user@gmail.com",
        avatar: "https://i.pravatar.cc/150?u=google",
        role: "user" as "user" // Explicitly specify this is the "user" literal type
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAdmin(false);
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  
  const signup = async (email: string, password: string, name: string) => {
    setIsLoading(true);
    try {
      // Mock signup - would be an actual API call in a real app
      const mockUser = {
        id: `user-${Math.random().toString(36).substring(2, 10)}`,
        name: name,
        email: email,
        avatar: `https://i.pravatar.cc/150?u=${email}`,
        role: "user" as "user" // Explicitly specify this is the "user" literal type
      };
      
      localStorage.setItem("user", JSON.stringify(mockUser));
      setUser(mockUser);
      setIsAdmin(false);
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setIsAdmin(false);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isLoading, 
        login,
        loginWithGoogle,
        signup,
        logout,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
