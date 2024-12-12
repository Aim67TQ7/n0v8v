import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AuthDebug = () => {
  const { session, isLoading } = useSessionContext();

  const { data: profile, error: profileError } = useQuery({
    queryKey: ["auth-debug-profile"],
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

  if (isLoading) {
    return <div>Checking authentication...</div>;
  }

  return (
    <div className="bg-gray-50 p-4 rounded-lg space-y-4 text-sm">
      <h3 className="font-semibold">Authentication Debug Info</h3>
      
      <div>
        <p><strong>Auth Status:</strong> {session ? "Authenticated" : "Not authenticated"}</p>
        {session && (
          <>
            <p><strong>User ID:</strong> {session.user.id}</p>
            <p><strong>Email:</strong> {session.user.email}</p>
            <p><strong>Role:</strong> {profile?.role || "N/A"}</p>
            <p><strong>Token Expiry:</strong> {new Date(session.expires_at! * 1000).toLocaleString()}</p>
          </>
        )}
      </div>

      {profileError && (
        <div className="text-red-600">
          <p><strong>Error:</strong> {profileError.message}</p>
        </div>
      )}
    </div>
  );
};