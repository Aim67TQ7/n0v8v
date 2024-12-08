import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthWrapper } from "@/components/AuthWrapper";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Modules from "./pages/Modules";
import LeanManufacturing from "./pages/LeanManufacturing";
import FiveSVision from "./pages/FiveSVision";
import TeamManagement from "./pages/TeamManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <AuthWrapper>
                  <Index />
                </AuthWrapper>
              }
            />
            <Route
              path="/modules"
              element={
                <AuthWrapper>
                  <Modules />
                </AuthWrapper>
              }
            />
            <Route
              path="/team"
              element={
                <AuthWrapper>
                  <TeamManagement />
                </AuthWrapper>
              }
            />
            <Route
              path="/operations/lean"
              element={
                <AuthWrapper>
                  <LeanManufacturing />
                </AuthWrapper>
              }
            />
            <Route
              path="/operations/lean/5s-vision"
              element={
                <AuthWrapper>
                  <FiveSVision />
                </AuthWrapper>
              }
            />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;