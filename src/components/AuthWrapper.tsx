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
        
        if (sessionError) throw sessionError;

        if (!session && !isDevelopment) {
          console.log("No session found, redirecting to login");
          sessionStorage.setItem('redirectAfterLogin', '/company-hub');
          navigate("/login");
          return;
        }

        if (!session) {
          console.log("No session but in development mode");
          return;
        }

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

        if (isDevelopment) {
          console.log("Development mode, allowing access");
          return;
        }

        if (!session || !isSuperUser) {
          console.log("Not authorized, redirecting to login");
          sessionStorage.setItem('redirectAfterLogin', '/company-hub');
          navigate("/login");
        }
      } catch (error) {
        console.error('Auth check error:', error);
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