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

// Lazy load operation pages
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