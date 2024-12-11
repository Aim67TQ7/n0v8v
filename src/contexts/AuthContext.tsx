import { createContext, useContext, ReactNode } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoading, session, error } = useSessionContext();
  
  const value = {
    isLoading,
    isAuthenticated: !!session,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}