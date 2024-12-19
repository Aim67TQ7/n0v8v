import { useSessionContext } from "@supabase/auth-helpers-react";

export const useAuth = () => {
  const { session, isLoading, supabaseClient: supabase } = useSessionContext();
  
  const user = session?.user;

  return {
    user,
    isLoading,
    supabase,
    session
  };
};