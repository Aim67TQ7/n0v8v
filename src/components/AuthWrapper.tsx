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
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (!session && !isDevelopment) {
          // Store the attempted URL to redirect back after login
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          navigate("/login");
          return;
        }

        if (!session) return;

        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();

        const isSuperUser = profile?.role === 'superuser';

        // In development, allow access without authentication
        if (isDevelopment) return;

        // In production, redirect to login if not authenticated or not superuser
        if (!session || !isSuperUser) {
          sessionStorage.setItem('redirectAfterLogin', location.pathname);
          navigate("/login");
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // On auth error, redirect to login
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