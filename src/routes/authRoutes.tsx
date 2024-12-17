import { RouteObject } from "react-router-dom";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import ResetPassword from "@/pages/ResetPassword";

export const authRoutes: RouteObject[] = [
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/register",
    element: <Register />
  },
  {
    path: "/reset-password",
    element: <ResetPassword />
  }
];