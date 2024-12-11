import { lazy } from "react";
import CompanyGPT from "@/pages/CompanyGPT";
import Settings from "@/pages/Settings";
import Modules from "@/pages/Modules";
import Index from "@/pages/Index";
import LeanManufacturing from "@/pages/LeanManufacturing";
import FiveSVision from "@/pages/FiveSVision";
import QualityAssurance from "@/pages/QualityAssurance";
import PartAnalysis from "@/pages/quality/PartAnalysis";
import ProductInspection from "@/pages/quality/ProductInspection";
import DMRDocumentation from "@/pages/quality/DMRDocumentation";
import FiveWhys from "@/pages/quality/FiveWhys";
import { PasswordReset } from "@/components/auth/PasswordReset";
import { UpdatePassword } from "@/components/auth/UpdatePassword";
import { VerifyOTP } from "@/components/auth/VerifyOTP";
import { ConfirmEmail } from "@/components/auth/ConfirmEmail";
import Login from "@/pages/Login";
import AdminPanel from "@/pages/AdminPanel";
import { AuthGuard } from "@/components/auth/AuthGuard";

const protectedRoute = (element: JSX.Element, role?: "superadmin" | "admin" | "employee") => (
  <AuthGuard requiredRole={role}>{element}</AuthGuard>
);

export const routes = [
  {
    path: "/",
    element: protectedRoute(<Index />)
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/reset-password",
    element: <PasswordReset />
  },
  {
    path: "/verify-otp",
    element: <VerifyOTP />
  },
  {
    path: "/update-password",
    element: <UpdatePassword />
  },
  {
    path: "/confirm-email",
    element: <ConfirmEmail />
  },
  {
    path: "/company-gpt",
    element: protectedRoute(<CompanyGPT />)
  },
  {
    path: "/settings",
    element: protectedRoute(<Settings />, "admin")
  },
  {
    path: "/modules",
    element: protectedRoute(<Modules />)
  },
  {
    path: "/admin",
    element: protectedRoute(<AdminPanel />, "superadmin")
  },
  {
    path: "/operations/lean",
    element: protectedRoute(<LeanManufacturing />)
  },
  {
    path: "/operations/lean/5s-vision",
    element: protectedRoute(<FiveSVision />)
  },
  {
    path: "/operations/quality",
    element: protectedRoute(<QualityAssurance />)
  },
  {
    path: "/operations/quality/part-analysis",
    element: protectedRoute(<PartAnalysis />)
  },
  {
    path: "/operations/quality/product-inspection",
    element: protectedRoute(<ProductInspection />)
  },
  {
    path: "/operations/quality/dmr",
    element: protectedRoute(<DMRDocumentation />)
  },
  {
    path: "/operations/quality/five-whys",
    element: protectedRoute(<FiveWhys />)
  }
];
