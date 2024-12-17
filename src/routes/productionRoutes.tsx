import { RouteObject } from "react-router-dom";
import { lazy } from "react";

const ProductionPlanning = lazy(() => import("@/pages/operations/production/Planning"));
const ProductionTracking = lazy(() => import("@/pages/operations/production/Tracking"));
const CapacityPlanning = lazy(() => import("@/pages/operations/production/Capacity"));
const BottleneckAnalysis = lazy(() => import("@/pages/operations/production/Bottlenecks"));
const EquipmentMonitoring = lazy(() => import("@/pages/operations/production/Equipment"));
const LaborEfficiency = lazy(() => import("@/pages/operations/production/Labor"));
const ShortagePrediction = lazy(() => import("@/pages/operations/production/Shortages"));

export const productionRoutes: RouteObject[] = [
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
  }
];