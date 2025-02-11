import { createContext, useContext, ReactNode, useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { User } from "@supabase/supabase-js";

interface AuthContextType {
  isLoading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isLoading: sessionLoading, session, error: sessionError } = useSessionContext();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const setupAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) throw error;
        
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
          async (event, currentSession) => {
            if (event === 'SIGNED_OUT') {
              navigate('/login');
            } else if (event === 'SIGNED_IN' && currentSession) {
              const redirectPath = sessionStorage.getItem('redirectAfterLogin');
              if (redirectPath) {
                sessionStorage.removeItem('redirectAfterLogin');
                navigate(redirectPath);
              } else {
                navigate('/company-hub');
              }
            }
          }
        );

        setIsLoading(false);

        return () => {
          subscription.unsubscribe();
        };
      } catch (err) {
        console.error("Auth setup error:", err);
        setError(err instanceof Error ? err : new Error('Authentication error'));
        setIsLoading(false);
      }
    };

    setupAuth();
  }, [navigate]);

  const value = {
    isLoading: isLoading || sessionLoading,
    isAuthenticated: !!session,
    error: error || sessionError,
    user: session?.user || null,
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