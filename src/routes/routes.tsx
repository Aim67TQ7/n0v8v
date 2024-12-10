import { Navigate } from "react-router-dom";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Modules from "@/pages/Modules";
import TeamManagement from "@/pages/TeamManagement";
import DataManagement from "@/pages/DataManagement";
import RAGUpload from "@/pages/data/RAGUpload";
import Settings from "@/pages/Settings";
import CompanyGPT from "@/pages/CompanyGPT";
import TrainingMatrix from "@/pages/TrainingMatrix";
import Operations from "@/pages/Operations";
import Analytics from "@/pages/Analytics";
import { useAuth } from "@/hooks/use-auth";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const WithHeader = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen">
        {children}
      </div>
    </ProtectedRoute>
  );
};

export const routes = [
  {
    path: "/",
    element: <WithHeader><Index /></WithHeader>
  },
  {
    path: "/login",
    element: <Login />
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
    path: "/data",
    element: <WithHeader><DataManagement /></WithHeader>
  },
  {
    path: "/data/rag-upload",
    element: <WithHeader><RAGUpload /></WithHeader>
  },
  {
    path: "/settings",
    element: <WithHeader><Settings /></WithHeader>
  },
  {
    path: "/company-gpt",
    element: <WithHeader><CompanyGPT /></WithHeader>
  },
  {
    path: "/training/matrix",
    element: <WithHeader><TrainingMatrix /></WithHeader>
  },
  {
    path: "/operations",
    element: <WithHeader><Operations /></WithHeader>
  },
  {
    path: "/analytics",
    element: <WithHeader><Analytics /></WithHeader>
  }
];