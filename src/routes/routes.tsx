import { lazy } from "react";
import CompanyGPT from "@/pages/CompanyGPT";
import Settings from "@/pages/Settings";
import Modules from "@/pages/Modules";
import Index from "@/pages/Index";

export const routes = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/company-gpt",
    element: <CompanyGPT />
  },
  {
    path: "/settings",
    element: <Settings />
  },
  {
    path: "/modules",
    element: <Modules />
  }
];