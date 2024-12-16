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
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error("Session error:", sessionError);
          throw sessionError;
        }

        // If no session and not in development mode, redirect to login
        if (!session && !isDevelopment) {
          console.log("No session found, redirecting to login");
          const currentPath = location.pathname;
          if (currentPath !== '/login') {
            sessionStorage.setItem('redirectAfterLogin', currentPath);
          }
          navigate("/login");
          return;
        }

        // If in development mode, allow access
        if (isDevelopment) {
          console.log("Development mode, allowing access");
          return;
        }

        // If we have a session, check if user is a superuser
        if (session) {
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error("Error fetching profile:", profileError);
            throw profileError;
          }

          const isSuperUser = profile?.role === 'superuser';

          // If not a superuser, redirect to login
          if (!isSuperUser) {
            console.log("Not authorized, redirecting to login");
            sessionStorage.setItem('redirectAfterLogin', location.pathname);
            navigate("/login");
          }
        }
      } catch (error) {
        console.error('Auth check error:', error);
        // On any error, redirect to login
        navigate("/login");
      }
    };

    checkAuth();
  }, [isLoading, isAuthenticated, navigate, location.pathname, isDevelopment]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <>{children}</>;
};