import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthWrapper } from "@/components/AuthWrapper";
import { Header } from "@/components/Header";
import { ThemeProvider } from "@/components/ThemeProvider";
import Index from "./pages/Index";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Modules from "./pages/Modules";
import LeanManufacturing from "./pages/LeanManufacturing";
import FiveSVision from "./pages/FiveSVision";
import TeamManagement from "./pages/TeamManagement";
import QualityAssurance from "./pages/QualityAssurance";
import PartAnalysis from "./pages/quality/PartAnalysis";
import ProductInspection from "./pages/quality/ProductInspection";
import DMRDocumentation from "./pages/quality/DMRDocumentation";
import FiveWhys from "./pages/quality/FiveWhys";
import TrainingMatrix from "./pages/training/TrainingMatrix";
import CompanyGPT from "./pages/CompanyGPT";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider>
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <BrowserRouter>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/admin"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <AdminPanel />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <Index />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/modules"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <Modules />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/team"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <TeamManagement />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/operations/lean"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <LeanManufacturing />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/operations/lean/5s-vision"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <FiveSVision />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/operations/quality"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <QualityAssurance />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/operations/quality/process-improvement"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <PartAnalysis />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/operations/quality/product-inspection"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <ProductInspection />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/operations/quality/dmr"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <DMRDocumentation />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/operations/quality/five-whys"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <FiveWhys />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/training/matrix"
                element={
                  <AuthWrapper>
                    <div className="min-h-screen flex flex-col">
                      <Header />
                      <TrainingMatrix />
                    </div>
                  </AuthWrapper>
                }
              />
              <Route
                path="/company-gpt"
                element={
                  <AuthWrapper>
                    <CompanyGPT />
                  </AuthWrapper>
                }
              />
            </Routes>
          </TooltipProvider>
        </BrowserRouter>
      </SessionContextProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;