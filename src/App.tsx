import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { allRoutes } from "@/routes/routes";
import { Header } from "@/components/Header";
import { useLocation } from "react-router-dom";
import { useState, Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import FiveSVision from "@/pages/FiveSVision";
import CompanyNews from "@/pages/operations/hr/CompanyNews";
import GoogleMapsScraper from "@/pages/leads/GoogleMapsScraper";
import AgentsHub from "@/pages/agents/AgentsHub";

const RouteLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/reset-password', '/register'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        <Suspense fallback={<RouteLoadingComponent />}>
          <Routes>
            <Route path="/" element={<Navigate to="/company-hub" replace />} />
            <Route path="/agents" element={<AgentsHub />} />
            <Route path="/operations/lean/5s-vision" element={<FiveSVision />} />
            <Route path="/operations/hr/company-news" element={<CompanyNews />} />
            <Route path="/leads/scraping/google-maps" element={<GoogleMapsScraper />} />
            {allRoutes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </Suspense>
      </main>
      <Toaster />
      <Sonner />
    </div>
  );
};

const App = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;