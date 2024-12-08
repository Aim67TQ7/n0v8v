import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const AuthWrapper = ({ children }: { children: React.ReactNode }) => {
  const { isLoading, session, error } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login");
    }
  }, [isLoading, session, navigate]);

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return <>{children}</>;
};