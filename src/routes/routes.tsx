import { Navigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Modules from "@/pages/Modules";
import LeanManufacturing from "@/pages/LeanManufacturing";
import FiveSVision from "@/pages/FiveSVision";
import TeamManagement from "@/pages/TeamManagement";
import QualityAssurance from "@/pages/QualityAssurance";
import PartAnalysis from "@/pages/quality/PartAnalysis";
import ProductInspection from "@/pages/quality/ProductInspection";
import DMRDocumentation from "@/pages/quality/DMRDocumentation";
import FiveWhys from "@/pages/quality/FiveWhys";
import TrainingMatrix from "@/pages/training/TrainingMatrix";
import CompanyGPT from "@/pages/CompanyGPT";
import VAVEAnalysis from "@/pages/operations/VAVEAnalysis";
import DataManagement from "@/pages/DataManagement";
import { Header } from "@/components/Header";

// Protected Route Component
export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useSessionContext();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Layout wrapper for pages that need the header
const WithHeader = ({ children }: { children: React.ReactNode }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    {children}
  </div>
);

// Route configuration
export const routes = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/",
    element: <WithHeader><Index /></WithHeader>
  },
  {
    path: "/modules",
    element: <WithHeader><Modules /></WithHeader>
  },
  {
    path: "/team",
    element: <WithHeader><TeamManagement /></WithHeader>
  },
  {
    path: "/operations/lean",
    element: <WithHeader><LeanManufacturing /></WithHeader>
  },
  {
    path: "/operations/lean/5s-vision",
    element: <WithHeader><FiveSVision /></WithHeader>
  },
  {
    path: "/operations/lean/vave-analysis",
    element: <WithHeader><VAVEAnalysis /></WithHeader>
  },
  {
    path: "/operations/quality",
    element: <WithHeader><QualityAssurance /></WithHeader>
  },
  {
    path: "/operations/quality/process-improvement",
    element: <WithHeader><PartAnalysis /></WithHeader>
  },
  {
    path: "/operations/quality/product-inspection",
    element: <WithHeader><ProductInspection /></WithHeader>
  },
  {
    path: "/operations/quality/dmr",
    element: <WithHeader><DMRDocumentation /></WithHeader>
  },
  {
    path: "/operations/quality/five-whys",
    element: <WithHeader><FiveWhys /></WithHeader>
  },
  {
    path: "/training/matrix",
    element: <WithHeader><TrainingMatrix /></WithHeader>
  },
  {
    path: "/company-gpt",
    element: <ProtectedRoute><CompanyGPT /></ProtectedRoute>
  },
  {
    path: "/data",
    element: <WithHeader><DataManagement /></WithHeader>
  }
];
