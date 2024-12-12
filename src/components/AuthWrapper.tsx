import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, isAuthenticated, error } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDevelopment = process.env.NODE_ENV === 'development';

  useEffect(() => {
    const checkAuth = async () => {
      if (!isLoading && !isAuthenticated) {
        // Store the attempted URL to redirect back after login
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        navigate("/login");
        return;
      }

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
        sessionStorage.setItem('redirectAfterLogin', location.pathname);
        navigate("/login");
      }
    };

    checkAuth();
  }, [isLoading, isAuthenticated, navigate, location.pathname, isDevelopment]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <>{children}</>;
};