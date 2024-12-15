import { lazy } from "react";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import { Dashboard } from "@/components/Dashboard";
import CompanyGPT from "@/pages/CompanyGPT";
import Modules from "@/pages/Modules";
import Tools from "@/pages/Tools";

// Lazy load all operation pages
const CustomerFocus = lazy(() => import("@/pages/operations/CustomerFocus"));
const Engineering = lazy(() => import("@/pages/operations/Engineering"));
const Facilities = lazy(() => import("@/pages/operations/Facilities"));
const Quality = lazy(() => import("@/pages/operations/Quality"));
const Production = lazy(() => import("@/pages/operations/Production"));
const SupplyChain = lazy(() => import("@/pages/operations/SupplyChain"));
const Lean = lazy(() => import("@/pages/operations/Lean"));
const Compliance = lazy(() => import("@/pages/operations/Compliance"));
const LeadScraping = lazy(() => import("@/pages/leads/LeadScraping"));
const FiveWhys = lazy(() => import("@/pages/operations/quality/FiveWhys"));
const Fishbone = lazy(() => import("@/pages/operations/quality/Fishbone"));
const FiveS = lazy(() => import("@/pages/operations/lean/FiveS"));
const Maintenance = lazy(() => import("@/pages/operations/Maintenance"));
const HROperations = lazy(() => import("@/pages/operations/hr"));
const CompanyNews = lazy(() => import("@/pages/operations/hr/CompanyNews"));
const TrainingMatrix = lazy(() => import("@/pages/training/TrainingMatrix"));
const EmployeeData = lazy(() => import("@/pages/operations/hr/EmployeeData"));
const EmployeeHandbook = lazy(() => import("@/pages/operations/hr/Handbook"));
const Insurance = lazy(() => import("@/pages/operations/hr/Insurance"));
const OrgChart = lazy(() => import("@/pages/operations/hr/OrgChart"));

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
    path: "/operations/customer-focus",
    element: <CustomerFocus />
  },
  {
    path: "/operations/engineering",
    element: <Engineering />
  },
  {
    path: "/operations/facilities",
    element: <Facilities />
  },
  {
    path: "/operations/quality",
    element: <Quality />
  },
  {
    path: "/operations/production",
    element: <Production />
  },
  {
    path: "/operations/supply-chain",
    element: <SupplyChain />
  },
  {
    path: "/operations/lean",
    element: <Lean />
  },
  {
    path: "/operations/compliance",
    element: <Compliance />
  },
  {
    path: "/leads/scraping",
    element: <LeadScraping />
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
    path: "/operations/lean/5s-vision",
    element: <FiveS />
  },
  {
    path: "/operations/maintenance",
    element: <Maintenance />
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
  }
];