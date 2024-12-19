import { RouteObject } from "react-router-dom";
import { lazy } from "react";
import Facilities from "@/pages/operations/Facilities";
import Production from "@/pages/operations/Production";
import MaintenanceSystem from "@/pages/maintenance/MaintenanceSystem";
import CompanyNews from "@/pages/operations/hr/CompanyNews";

const HROperations = lazy(() => import("@/pages/operations/hr"));
const Quality = lazy(() => import("@/pages/operations/Quality"));
const PartAnalysis = lazy(() => import("@/pages/quality/PartAnalysis"));
const ProductInspection = lazy(() => import("@/pages/quality/ProductInspection"));
const DMRDocumentation = lazy(() => import("@/pages/quality/DMRDocumentation"));
const FiveWhys = lazy(() => import("@/pages/quality/FiveWhys"));
const Fishbone = lazy(() => import("@/pages/quality/Fishbone"));
const ProcessImprovement = lazy(() => import("@/pages/quality/ProcessImprovement"));
const VAVEAnalysis = lazy(() => import("@/pages/operations/VAVEAnalysis"));
const Sales = lazy(() => import("@/pages/operations/Sales"));
const SupplyChain = lazy(() => import("@/pages/operations/SupplyChain"));
const Compliance = lazy(() => import("@/pages/operations/Compliance"));
const Lean = lazy(() => import("@/pages/operations/Lean"));

export const operationsRoutes: RouteObject[] = [
  {
    path: "/operations/facilities",
    element: <Facilities />
  },
  {
    path: "/operations/facilities/maintenance",
    element: <MaintenanceSystem />
  },
  {
    path: "/operations/production",
    element: <Production />
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
    path: "/operations/sales",
    element: <Sales />
  },
  {
    path: "/operations/supply-chain",
    element: <SupplyChain />
  },
  {
    path: "/operations/compliance",
    element: <Compliance />
  },
  {
    path: "/operations/lean",
    element: <Lean />
  }
];