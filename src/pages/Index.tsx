import { useSessionContext } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Dashboard } from "@/components/Dashboard";

const Index = () => {
  const { session } = useSessionContext();

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="min-h-screen">
      <div className="flex justify-end p-4">
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
      <Dashboard />
    </div>
  );
};

export default Index;