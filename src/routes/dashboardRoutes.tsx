import { RouteObject } from "react-router-dom";
import { Dashboard } from "@/components/Dashboard";
import CompanyGPT from "@/pages/CompanyGPT";
import Modules from "@/pages/Modules";
import Tools from "@/pages/Tools";
import CompanyHub from "@/pages/CompanyHub";

export const dashboardRoutes: RouteObject[] = [
  {
    path: "/",
    element: <Dashboard />
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
  }
];