import { Routes, Route, useLocation } from "react-router-dom";
import { Header } from "@/components/Header";
import { routes } from "@/routes/routes";

export const AppContent = () => {
  const location = useLocation();
  const isGPTRoute = location.pathname === "/company-gpt";

  return (
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
  );
};