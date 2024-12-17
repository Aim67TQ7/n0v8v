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

export const operationsRoutes: RouteObject[] = [
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
  }
];