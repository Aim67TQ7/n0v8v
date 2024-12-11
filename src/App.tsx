import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { Header } from "@/components/Header";
import { routes } from "@/routes/routes";
import { AuthWrapper } from "@/components/AuthWrapper";

const App = () => {
  const publicPaths = ["/login", "/reset-password"];

  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {routes.map((route) => {
              const Component = publicPaths.includes(route.path) ? (
                route.element
              ) : (
                <AuthWrapper>{route.element}</AuthWrapper>
              );

              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={Component}
                />
              );
            })}
          </Routes>
        </main>
      </div>
      <Toaster />
      <Sonner />
    </AppProviders>
  );
};

export default App;