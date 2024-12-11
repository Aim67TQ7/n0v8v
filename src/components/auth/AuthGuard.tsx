import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface AuthGuardProps {
  children: React.ReactNode;
  requiredRole?: "superadmin" | "admin" | "employee";
}

export const AuthGuard = ({ children, requiredRole }: AuthGuardProps) => {
  const { session, isLoading: sessionLoading } = useSessionContext();
  const navigate = useNavigate();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*, company:companies(*)")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/login");
      return;
    }

    if (!profileLoading && profile && requiredRole) {
      const hasAccess = 
        requiredRole === "superadmin" ? profile.role === "superadmin" :
        requiredRole === "admin" ? ["admin", "superadmin"].includes(profile.role) :
        ["employee", "admin", "superadmin"].includes(profile.role);

      if (!hasAccess) {
        navigate("/");
      }
    }
  }, [session, profile, sessionLoading, profileLoading, navigate, requiredRole]);

  if (sessionLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};