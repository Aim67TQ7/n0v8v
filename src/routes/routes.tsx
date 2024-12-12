import { lazy } from "react";
import CompanyGPT from "@/pages/CompanyGPT";
import Settings from "@/pages/Settings";
import Modules from "@/pages/Modules";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import LeanManufacturing from "@/pages/LeanManufacturing";
import FiveSVision from "@/pages/FiveSVision";
import QualityAssurance from "@/pages/QualityAssurance";
import PartAnalysis from "@/pages/quality/PartAnalysis";
import ProductInspection from "@/pages/quality/ProductInspection";
import DMRDocumentation from "@/pages/quality/DMRDocumentation";
import FiveWhys from "@/pages/quality/FiveWhys";

export const routes = [
  {
    path: "/",
    element: <Index />
  },
  {
    path: "/login",
    element: <Login />
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
  },
  {
    path: "/operations/lean",
    element: <LeanManufacturing />
  },
  {
    path: "/operations/lean/5s-vision",
    element: <FiveSVision />
  },
  {
    path: "/operations/quality",
    element: <QualityAssurance />
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
  }
];
