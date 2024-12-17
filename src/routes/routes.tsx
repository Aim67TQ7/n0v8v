import { lazy, Suspense } from "react";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import { Dashboard } from "@/components/Dashboard";
import CompanyGPT from "@/pages/CompanyGPT";
import Modules from "@/pages/Modules";
import Tools from "@/pages/Tools";
import CompanyHub from "@/pages/CompanyHub";
import Facilities from "@/pages/operations/Facilities";
import Production from "@/pages/operations/Production";
import MaintenanceSystem from "@/pages/maintenance/MaintenanceSystem";

const HROperations = lazy(() => import("@/pages/operations/hr"));
const CompanyNews = lazy(() => import("@/pages/operations/hr/CompanyNews"));
const TrainingMatrix = lazy(() => import("@/pages/training/TrainingMatrix"));
const EmployeeData = lazy(() => import("@/pages/operations/hr/EmployeeData"));
const EmployeeHandbook = lazy(() => import("@/pages/operations/hr/Handbook"));
const Insurance = lazy(() => import("@/pages/operations/hr/Insurance"));
const OrgChart = lazy(() => import("@/pages/operations/hr/OrgChart"));

// Quality modules
const Quality = lazy(() => import("@/pages/operations/Quality"));
const PartAnalysis = lazy(() => import("@/pages/quality/PartAnalysis"));
const ProductInspection = lazy(() => import("@/pages/quality/ProductInspection"));
const DMRDocumentation = lazy(() => import("@/pages/quality/DMRDocumentation"));
const FiveWhys = lazy(() => import("@/pages/quality/FiveWhys"));
const Fishbone = lazy(() => import("@/pages/quality/Fishbone"));
const ProcessImprovement = lazy(() => import("@/pages/quality/ProcessImprovement"));
const VAVEAnalysis = lazy(() => import("@/pages/operations/VAVEAnalysis"));

// Production modules
const ProductionPlanning = lazy(() => import("@/pages/operations/production/Planning"));
const ProductionTracking = lazy(() => import("@/pages/operations/production/Tracking"));
const CapacityPlanning = lazy(() => import("@/pages/operations/production/Capacity"));
const BottleneckAnalysis = lazy(() => import("@/pages/operations/production/Bottlenecks"));
const EquipmentMonitoring = lazy(() => import("@/pages/operations/production/Equipment"));
const LaborEfficiency = lazy(() => import("@/pages/operations/production/Labor"));
const ShortagePrediction = lazy(() => import("@/pages/operations/production/Shortages"));

const WebScraping = lazy(() => import("@/pages/leads/WebScraping"));
const GoogleMapsScraper = lazy(() => import("@/pages/leads/GoogleMapsScraper"));

// Loading component for Suspense fallback
const LoadingComponent = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
);

// Wrap lazy components with Suspense
const withSuspense = (Component: React.LazyExoticComponent<any>) => (
  <Suspense fallback={<LoadingComponent />}>
    <Component />
  </Suspense>
);

export const routes = [
  {
    path: "/",
    element: <Dashboard />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/company-hub",
    element: <CompanyHub />
  },
  {
    path: "/company-gpt",
    element: <CompanyGPT />
  },
  {
    path: "/modules",
    element: <Modules />
  },
  {
    path: "/tools",
    element: <Tools />
  },
  {
    path: "/operations/facilities",
    element: <Facilities />
  },
  {
    path: "/operations/production",
    element: <Production />
  },
  {
    path: "/operations/maintenance",
    element: <MaintenanceSystem />
  },
  {
    path: "/operations/production/planning",
    element: withSuspense(ProductionPlanning)
  },
  {
    path: "/operations/production/tracking",
    element: withSuspense(ProductionTracking)
  },
  {
    path: "/operations/production/capacity",
    element: withSuspense(CapacityPlanning)
  },
  {
    path: "/operations/production/bottlenecks",
    element: withSuspense(BottleneckAnalysis)
  },
  {
    path: "/operations/production/equipment",
    element: withSuspense(EquipmentMonitoring)
  },
  {
    path: "/operations/production/labor",
    element: withSuspense(LaborEfficiency)
  },
  {
    path: "/operations/production/shortages",
    element: withSuspense(ShortagePrediction)
  },
  {
    path: "/operations/hr",
    element: withSuspense(HROperations)
  },
  {
    path: "/operations/hr/company-news",
    element: withSuspense(CompanyNews)
  },
  {
    path: "/operations/hr/training-matrix",
    element: withSuspense(TrainingMatrix)
  },
  {
    path: "/operations/hr/employee-data",
    element: withSuspense(EmployeeData)
  },
  {
    path: "/operations/hr/handbook",
    element: withSuspense(EmployeeHandbook)
  },
  {
    path: "/operations/hr/insurance",
    element: withSuspense(Insurance)
  },
  {
    path: "/operations/hr/org-chart",
    element: withSuspense(OrgChart)
  },
  // Quality routes
  {
    path: "/operations/quality",
    element: withSuspense(Quality)
  },
  {
    path: "/operations/quality/part-analysis",
    element: withSuspense(PartAnalysis)
  },
  {
    path: "/operations/quality/product-inspection",
    element: withSuspense(ProductInspection)
  },
  {
    path: "/operations/quality/dmr",
    element: withSuspense(DMRDocumentation)
  },
  {
    path: "/operations/quality/five-whys",
    element: withSuspense(FiveWhys)
  },
  {
    path: "/operations/quality/fishbone",
    element: withSuspense(Fishbone)
  },
  {
    path: "/operations/quality/process-improvement",
    element: withSuspense(ProcessImprovement)
  },
  {
    path: "/operations/quality/vave",
    element: withSuspense(VAVEAnalysis)
  },
  {
    path: "/leads/scraping",
    element: withSuspense(WebScraping)
  },
  {
    path: "/leads/scraping/google-maps",
    element: withSuspense(GoogleMapsScraper)
  }
];
