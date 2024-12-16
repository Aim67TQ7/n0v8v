import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { routes } from "@/routes/routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/AuthWrapper";
import { Header } from "@/components/Header";
import { useLocation, Navigate } from "react-router-dom";
import { useState, Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";
import { useAuth } from "@/contexts/AuthContext";

// Loading component for route transitions
const RouteLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

const App = () => {
  const publicRoutes = ['/login', '/reset-password', '/register'];
  const location = useLocation();
  const showHeader = location.pathname !== '/company-gpt';
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
    <AppProviders>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {showHeader && <Header />}
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

              {/* Public routes (no auth required) */}
              {routes
                .filter(route => publicRoutes.includes(route.path))
                .map(route => (
                  <Route
                    key={route.path}
                    path={route.path}
                    element={route.element}
                  />
                ))}

              {/* Protected routes */}
              <Route
                path="*"
                element={
                  <AuthWrapper>
                    <main className="flex-1">
                      <Routes>
                        {routes
                          .filter(route => !publicRoutes.includes(route.path))
                          .map(route => (
                            <Route
                              key={route.path}
                              path={route.path}
                              element={route.element}
                            />
                          ))}
                      </Routes>
                    </main>
                  </AuthWrapper>
                }
              />
            </Routes>
          </Suspense>
        </div>
        <Toaster />
        <Sonner />
      </AuthProvider>
    </AppProviders>
  );
};

export default App;