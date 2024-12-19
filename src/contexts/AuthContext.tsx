import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoading: sessionLoading, session, error: sessionError } = useSessionContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        setIsLoading(false);
      } catch (err) {
        console.error("Auth setup error:", err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
        setIsLoading(false);
      }
    };

    setupAuth();
  }, []);

  const value = {
    isLoading: isLoading || sessionLoading,
    isAuthenticated: !!session,
    error: error || sessionError,
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