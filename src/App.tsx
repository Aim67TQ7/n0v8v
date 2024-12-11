import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { AppContent } from "@/components/AppContent";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const AppWithAuth = () => {
  const { user, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login");
    }
  }, [user, isLoading, navigate]);

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