import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { allRoutes } from "@/routes/routes";
import { Header } from "@/components/Header";
import { useLocation } from "react-router-dom";
import { useState, Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import ResetPassword from "@/pages/auth/ResetPassword";
import { useSessionContext } from "@supabase/auth-helpers-react";

const RouteLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const AppContent = () => {
  const location = useLocation();
  const { session } = useSessionContext();
  const hideHeaderRoutes = ['/login', '/reset-password', '/register'];
  const showHeader = !hideHeaderRoutes.includes(location.pathname);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  // Redirect to login if not authenticated
  if (!session && !hideHeaderRoutes.includes(location.pathname)) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      {showHeader && <Header />}
      <main className="flex-1">
        <Suspense fallback={<RouteLoadingComponent />}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Protected routes */}
            {session && (
              <>
                <Route path="/" element={<Navigate to="/company-hub" replace />} />
                {allRoutes.map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}
              </>
            )}
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