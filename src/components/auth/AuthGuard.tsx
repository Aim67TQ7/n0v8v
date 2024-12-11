import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface AuthGuardProps {
  children: React.ReactNode;
}

export const AuthGuard = ({ children }: AuthGuardProps) => {
  const { session, isLoading: sessionLoading } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*, company:companies(*)")
        .eq("id", session.user.id)
        .maybeSingle();
      
      if (error) {
        console.error("Profile fetch error:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user profile. Please try again.",
          variant: "destructive",
        });
        return null;
      }

      if (!data) {
        toast({
          title: "Profile Not Found",
          description: "Your user profile could not be found. Please contact support.",
          variant: "destructive",
        });
        return null;
      }
      
      return data;
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  useEffect(() => {
    if (!sessionLoading && !session) {
      navigate("/login");
      return;
    }

    if (!profileLoading && session && !profile) {
      // If we have a session but no profile, something is wrong
      navigate("/login");
      return;
    }
  }, [session, profile, sessionLoading, profileLoading, navigate]);

  if (sessionLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <>{children}</>;
};