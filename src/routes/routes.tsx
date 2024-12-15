import { lazy } from "react";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";
import { Dashboard } from "@/components/Dashboard";
import CompanyGPT from "@/pages/CompanyGPT";
import Modules from "@/pages/Modules";
import Tools from "@/pages/Tools";
import { CustomerFocus } from "@/pages/operations/CustomerFocus";
import { Engineering } from "@/pages/operations/Engineering";
import { Facilities } from "@/pages/operations/Facilities";
import { Quality } from "@/pages/operations/Quality";
import { Production } from "@/pages/operations/Production";
import { SupplyChain } from "@/pages/operations/SupplyChain";
import { Lean } from "@/pages/operations/Lean";
import { Compliance } from "@/pages/operations/Compliance";
import { LeadScraping } from "@/pages/leads/LeadScraping";
import { FiveWhys } from "@/pages/operations/quality/FiveWhys";
import { Fishbone } from "@/pages/operations/quality/Fishbone";
import { FiveS } from "@/pages/operations/lean/FiveS";
import { Maintenance } from "@/pages/operations/Maintenance";

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