import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { AppContent } from "@/components/AppContent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";

const AppWithAuth = () => {
  const { session, isLoading } = useSessionContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !session) {
      navigate("/login");
    }
  }, [session, isLoading, navigate]);

  return <AppContent />;
};

const App = () => {
  return (
    <AppProviders>
      <AppWithAuth />
      <Toaster />
      <Sonner />
    </AppProviders>
  );
};

export default App;