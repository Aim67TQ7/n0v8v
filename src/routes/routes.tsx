import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthWrapper } from "@/components/AuthWrapper";
import { useAuth } from "@/contexts/AuthContext";
import { authRoutes } from "./authRoutes";
import { dashboardRoutes } from "./dashboardRoutes";
import { operationsRoutes } from "./operationsRoutes";
import { productionRoutes } from "./productionRoutes";
import { marketingRoutes } from "./marketingRoutes";
import AgentsHub from "@/pages/agents/AgentsHub";
import RAGUpload from "@/pages/data/RAGUpload";
import DocumentProcessing from "@/pages/tools/DocumentProcessing";
import FAQ from "@/pages/FAQ";

const RouteLoadingComponent = () => (
  <div className="flex items-center justify-center min-h-[50vh]">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Combine all routes for export
export const allRoutes = [
  ...authRoutes,
  ...dashboardRoutes,
  ...operationsRoutes,
  ...productionRoutes,
  ...marketingRoutes,
  {
    path: "/agents",
    element: <AgentsHub />
  },
  {
    path: "/tools/process-document",
    element: <DocumentProcessing />
  },
  {
    path: "/tools/vectorization",
    element: <RAGUpload />
  },
  {
    path: "/faq",
    element: <FAQ />
  }
];

export const AppRoutes = () => {
  const { isAuthenticated } = useAuth();
  const publicRoutes = ['/login', '/reset-password', '/register'];

  return (
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
        {authRoutes.map(route => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Protected routes */}
        <Route element={<AuthWrapper />}>
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
        </Route>
      </Routes>
    </Suspense>
  );
};
