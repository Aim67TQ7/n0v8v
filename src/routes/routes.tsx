import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { dashboardRoutes } from "./dashboardRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { productionRoutes } from "./productionRoutes";
import { marketingRoutes } from "./marketingRoutes";
import AgentsHub from "@/pages/agents/AgentsHub";

// Loading component for route transitions
const RouteLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Combine all routes for export
export const allRoutes = [
  ...dashboardRoutes,
  ...operationsRoutes,
  ...productionRoutes,
  ...marketingRoutes,
  {
    path: "/agents",
    element: <AgentsHub />
  }
];

export const AppRoutes = () => {
  return (
    <Suspense fallback={<RouteLoadingComponent />}>
      <Routes>
        {/* Dashboard routes */}
        {dashboardRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Operations routes */}
        {operationsRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Production routes */}
        {productionRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Marketing routes */}
        {marketingRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Routes>
    </Suspense>
  );
};