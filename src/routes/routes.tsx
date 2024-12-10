import { lazy } from "react";
import { AuthWrapper } from "@/components/AuthWrapper";
import Login from "@/pages/Login";
import { ChangePasswordForm } from "@/components/auth/ChangePasswordForm";
import { CompanyGPT } from "@/pages/CompanyGPT";
import { Settings } from "@/pages/Settings";
import { Modules } from "@/pages/Modules";
import { Index } from "@/pages/Index";

export const routes = [
  {
    path: "/",
    element: (
      <AuthWrapper>
        <Index />
      </AuthWrapper>
    ),
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/change-password",
    element: <ChangePasswordForm />,
  },
  {
    path: "/company-gpt",
    element: (
      <AuthWrapper>
        <CompanyGPT />
      </AuthWrapper>
    ),
  },
  {
    path: "/settings",
    element: (
      <AuthWrapper>
        <Settings />
      </AuthWrapper>
    ),
  },
  {
    path: "/modules",
    element: (
      <AuthWrapper>
        <Modules />
      </AuthWrapper>
    ),
  },
];