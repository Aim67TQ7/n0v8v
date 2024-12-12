import { lazy } from "react";
import CompanyGPT from "@/pages/CompanyGPT";
import Settings from "@/pages/Settings";
import Modules from "@/pages/Modules";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import ResetPassword from "@/pages/ResetPassword";
import LeanManufacturing from "@/pages/LeanManufacturing";
import FiveSVision from "@/pages/FiveSVision";
import QualityAssurance from "@/pages/QualityAssurance";
import PartAnalysis from "@/pages/quality/PartAnalysis";
import ProductInspection from "@/pages/quality/ProductInspection";
import DMRDocumentation from "@/pages/quality/DMRDocumentation";
import FiveWhys from "@/pages/quality/FiveWhys";
import { AuthWrapper } from "@/components/AuthWrapper";
import TrainingMatrix from "@/pages/training/TrainingMatrix";
import TeamManagement from "@/pages/TeamManagement";
import Company from "@/pages/team/Company";
import PricingPage from "@/pages/Pricing";

import Locations from "@/pages/team/Locations";
import Departments from "@/pages/team/Departments";
import WorkCenters from "@/pages/team/WorkCenters";

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
    path: "/pricing",
    element: <PricingPage />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  },
  {
    path: "/company-gpt",
    element: <AuthWrapper><CompanyGPT /></AuthWrapper>
  },
  {
    path: "/team/locations",
    element: <AuthWrapper><Locations /></AuthWrapper>
  },
  {
    path: "/team/departments",
    element: <AuthWrapper><Departments /></AuthWrapper>
  },
  {
    path: "/team/workcenters",
    element: <AuthWrapper><WorkCenters /></AuthWrapper>
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
    path: "/team",
    element: <AuthWrapper><TeamManagement /></AuthWrapper>
  },
  {
    path: "/team/company",
    element: <AuthWrapper><Company /></AuthWrapper>
  },
  {
    path: "/training/matrix",
    element: <AuthWrapper><TrainingMatrix /></AuthWrapper>
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
