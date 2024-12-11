import { Routes, Route, useLocation } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { Header } from "@/components/Header";
import { routes } from "@/routes/routes";

const App = () => {
  const location = useLocation();
  const isGPTRoute = location.pathname === "/company-gpt";

  return (
    <AppProviders>
      <div className="min-h-screen flex flex-col">
        {!isGPTRoute && <Header />}
        <main className={`flex-1 ${!isGPTRoute ? '' : 'h-screen'}`}>
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
    </AppProviders>
  );
};

export default App;