import { lazy } from "react";
const MarketResearch = lazy(() => import("@/pages/marketing/MarketResearch"));

export const marketingRoutes = [
  {
    path: "/marketing/research",
    element: <MarketResearch />
  }
];