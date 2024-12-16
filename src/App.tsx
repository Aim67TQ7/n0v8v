import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { routes } from "@/routes/routes";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthWrapper } from "@/components/AuthWrapper";
import { Header } from "@/components/Header";
import { useLocation } from "react-router-dom";
import { useState, Suspense } from "react";
import { SplashScreen } from "@/components/SplashScreen";

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

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AppProviders>
      <AuthProvider>
        <div className="min-h-screen flex flex-col">
          {showHeader && <Header />}
          <Suspense fallback={<RouteLoadingComponent />}>
            <Routes>
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

              {/* CompanyGPT route (requires auth) */}
              <Route
                path="/company-gpt"
                element={
                  <AuthWrapper>
                    <main className="flex-1">
                      <Routes>
                        {routes
                          .filter(route => route.path === '/company-gpt')
                          .map(route => (
                            <Route
                              key={route.path}
                              path="/"
                              element={route.element}
                            />
                          ))}
                      </Routes>
                    </main>
                  </AuthWrapper>
                }
              />

              {/* All other protected routes */}
              <Route
                path="*"
                element={
                  <AuthWrapper>
                    <main className="flex-1">
                      <Routes>
                        {routes
                          .filter(route => !publicRoutes.includes(route.path) && route.path !== '/company-gpt')
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