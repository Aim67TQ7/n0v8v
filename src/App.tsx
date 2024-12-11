import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { AppContent } from "@/components/AppContent";

const App = () => {
  return (
    <AppProviders>
      <AppContent />
      <Toaster />
      <Sonner />
    </AppProviders>
  );
};

export default App;