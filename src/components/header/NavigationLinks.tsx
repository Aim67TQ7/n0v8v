import { Link } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const NavigationLinks = () => {
  const { session } = useSessionContext();

  const { data: profile } = useQuery({
    queryKey: ["user-profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const isAdmin = profile?.role === "admin";

  return (
    <nav className="flex items-center gap-6">
      {!session ? (
        <div className="flex items-center gap-4">
          <Button variant="ghost" asChild>
            <Link to="/login" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Login
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/reset-password" className="text-sm font-medium">
              Forgot Password?
            </Link>
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <Link to="/" className="text-sm font-medium text-gray-700 hover:text-gray-900">
            Dashboard
          </Link>
          {isAdmin && (
            <Link to="/admin" className="text-sm font-medium text-gray-700 hover:text-gray-900">
              Admin Panel
            </Link>
          )}
          <Button variant="outline" asChild>
            <Link to="/confirm-email" className="text-sm font-medium">
              Update Email
            </Link>
          </Button>
        </div>
      )}
    </nav>
  );
};