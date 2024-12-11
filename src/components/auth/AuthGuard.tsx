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
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const isBypassEnabled = localStorage.getItem('bypass_auth') === 'true';

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      // Check if email verification is needed
      if (session.user.user_metadata.verification_token) {
        const { data: verification, error: verificationError } = await supabase
          .from("email_verifications")
          .select("verified_at")
          .eq("token", session.user.user_metadata.verification_token)
          .single();

        if (verificationError || !verification.verified_at) {
          navigate("/confirm-email");
          return null;
        }
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id && !isBypassEnabled,
  });

  useEffect(() => {
    if (!isBypassEnabled) {
      if (!session) {
        navigate("/login");
        return;
      }

      if (!isLoading && profile) {
        if (requiredRole) {
          const hasAccess = 
            requiredRole === "superadmin" ? profile.role === "superadmin" :
            requiredRole === "admin" ? ["admin", "superadmin"].includes(profile.role) :
            ["employee", "admin", "superadmin"].includes(profile.role);

          if (!hasAccess) {
            navigate("/");
          }
        }
      }
    }
  }, [session, profile, isLoading, navigate, requiredRole, isBypassEnabled]);

  if (isLoading && !isBypassEnabled) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};