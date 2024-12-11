import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { Header } from "@/components/Header";
import { routes } from "@/routes/routes";
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => (
  <AppProviders>
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            {routes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}
          </Routes>
        </main>
      </div>
      <Toaster />
      <Sonner />
    </AuthProvider>
  </AppProviders>
);

export default App;