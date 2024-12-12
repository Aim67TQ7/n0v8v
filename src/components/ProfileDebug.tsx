import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const ProfileDebug = () => {
  const { session } = useSessionContext();

  const { data: profile, error } = useQuery({
    queryKey: ["debug-profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      console.log("Current user ID:", session.user.id);
      
      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select(`
          *,
          company:companies(*)
        `)
        .eq("id", session.user.id)
        .single();
      
      if (profileError) {
        console.error("Profile fetch error:", profileError);
        throw profileError;
      }
      
      console.log("Profile data:", profileData);
      return profileData;
    },
    enabled: !!session?.user?.id,
  });

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <h3 className="font-bold">Error fetching profile:</h3>
        <pre className="mt-2 text-sm">{JSON.stringify(error, null, 2)}</pre>
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50 rounded-md">
      <h2 className="text-xl font-bold mb-4">Profile Debug Information</h2>
      
      <div className="space-y-2">
        <h3 className="font-semibold">Session Status:</h3>
        <pre className="bg-white p-2 rounded text-sm">
          {session ? "Logged in" : "Not logged in"}
        </pre>
        
        {session && (
          <>
            <h3 className="font-semibold">User ID:</h3>
            <pre className="bg-white p-2 rounded text-sm">
              {session.user.id}
            </pre>
            
            <h3 className="font-semibold">Email:</h3>
            <pre className="bg-white p-2 rounded text-sm">
              {session.user.email}
            </pre>
          </>
        )}
        
        <h3 className="font-semibold">Profile Data:</h3>
        <pre className="bg-white p-2 rounded text-sm">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </div>
  );
};