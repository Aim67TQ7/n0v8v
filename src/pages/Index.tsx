import { Hero } from "@/components/Hero";
import { Features } from "@/components/Features";
import { AICapabilities } from "@/components/AICapabilities";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

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
      <Hero />
      <Features />
      <AICapabilities />
    </div>
  );
};

export default Index;