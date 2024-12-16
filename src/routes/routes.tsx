import { lazy } from "react";
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

// Lazy load operation pages
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
    path: "/operations/production/planning",
    element: <ProductionPlanning />
  },
  {
    path: "/operations/production/tracking",
    element: <ProductionTracking />
  },
  {
    path: "/operations/production/capacity",
    element: <CapacityPlanning />
  },
  {
    path: "/operations/production/bottlenecks",
    element: <BottleneckAnalysis />
  },
  {
    path: "/operations/production/equipment",
    element: <EquipmentMonitoring />
  },
  {
    path: "/operations/production/labor",
    element: <LaborEfficiency />
  },
  {
    path: "/operations/production/shortages",
    element: <ShortagePrediction />
  },
  {
    path: "/operations/hr",
    element: <HROperations />
  },
  {
    path: "/operations/hr/company-news",
    element: <CompanyNews />
  },
  {
    path: "/operations/hr/training-matrix",
    element: <TrainingMatrix />
  },
  {
    path: "/operations/hr/employee-data",
    element: <EmployeeData />
  },
  {
    path: "/operations/hr/handbook",
    element: <EmployeeHandbook />
  },
  {
    path: "/operations/hr/insurance",
    element: <Insurance />
  },
  {
    path: "/operations/hr/org-chart",
    element: <OrgChart />
  },
  // Quality routes
  {
    path: "/operations/quality",
    element: <Quality />
  },
  {
    path: "/operations/quality/part-analysis",
    element: <PartAnalysis />
  },
  {
    path: "/operations/quality/product-inspection",
    element: <ProductInspection />
  },
  {
    path: "/operations/quality/dmr",
    element: <DMRDocumentation />
  },
  {
    path: "/operations/quality/five-whys",
    element: <FiveWhys />
  },
  {
    path: "/operations/quality/fishbone",
    element: <Fishbone />
  },
  {
    path: "/operations/quality/process-improvement",
    element: <ProcessImprovement />
  },
  {
    path: "/operations/quality/vave",
    element: <VAVEAnalysis />
  },
  {
    path: "/leads/scraping",
    element: <WebScraping />
  },
  {
    path: "/leads/scraping/google-maps",
    element: <GoogleMapsScraper />
  }
];
