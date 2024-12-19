import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { allRoutes } from "@/routes/routes";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/AuthWrapper";
import { useLocation } from "react-router-dom";
import { useState, Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { Header } from "@/components/Header";
import Login from "@/pages/auth/Login";
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
  const publicRoutes = ['/login', '/reset-password', '/register'];
  const location = useLocation();
  const hideHeaderRoutes = ['/login', '/reset-password', '/register'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated } = useAuth();

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Redirect to login if not authenticated and not on a public route
  if (!isAuthenticated && !publicRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        <Suspense fallback={<RouteLoadingComponent />}>
          <Routes>
            {/* Default route redirect */}
            <Route 
              path="/" 
              element={
                isAuthenticated ? (
                  <Navigate to="/company-hub" replace />
                ) : (
                  <Navigate to="/login" replace />
                )
              } 
            />

            {/* Public routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route element={<AuthWrapper />}>
              <Route path="/agents" element={<AgentsHub />} />
              <Route path="/operations/lean/5s-vision" element={<FiveSVision />} />
              <Route path="/operations/hr/company-news" element={<CompanyNews />} />
              <Route path="/leads/scraping/google-maps" element={<GoogleMapsScraper />} />
              {allRoutes
                .filter(route => !publicRoutes.includes(route.path))
                .map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
            </Route>
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
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </AppProviders>
  );
};

export default App;