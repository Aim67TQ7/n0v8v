import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const checkSuperUser = async () => {
      if (!isAuthenticated) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', (await supabase.auth.getUser()).data.user?.id)
        .single();

      const isSuperUser = profile?.role === 'superuser';

      // In development, allow access without authentication
      if (isDevelopment) return;

      // In production, redirect to login if not authenticated or not superuser
      if (!isLoading && (!isAuthenticated || !isSuperUser)) {
        navigate("/login");
      }
    };

    checkSuperUser();
  }, [isLoading, isAuthenticated, navigate, isDevelopment]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <>{children}</>;
};