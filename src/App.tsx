import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { supabase } from "@/integrations/supabase/client";
import { Header } from "@/components/Header";
import Index from "./pages/Index";
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
  <QueryClientProvider client={queryClient}>
    <SessionContextProvider supabaseClient={supabase}>
      <BrowserRouter>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route
              path="/"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <Index />
                </div>
              }
            />
            <Route
              path="/modules"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <Modules />
                </div>
              }
            />
            <Route
              path="/team"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <TeamManagement />
                </div>
              }
            />
            <Route
              path="/operations/lean"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <LeanManufacturing />
                </div>
              }
            />
            <Route
              path="/operations/lean/5s-vision"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <FiveSVision />
                </div>
              }
            />
            <Route
              path="/operations/quality"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <QualityAssurance />
                </div>
              }
            />
            <Route
              path="/operations/quality/process-improvement"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <PartAnalysis />
                </div>
              }
            />
            <Route
              path="/operations/quality/product-inspection"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <ProductInspection />
                </div>
              }
            />
            <Route
              path="/operations/quality/dmr"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <DMRDocumentation />
                </div>
              }
            />
            <Route
              path="/operations/quality/five-whys"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <FiveWhys />
                </div>
              }
            />
            <Route
              path="/training/matrix"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <TrainingMatrix />
                </div>
              }
            />
            <Route
              path="/company-gpt"
              element={
                <div className="min-h-screen flex flex-col">
                  <Header />
                  <CompanyGPT />
                </div>
              }
            />
          </Routes>
        </TooltipProvider>
      </BrowserRouter>
    </SessionContextProvider>
  </QueryClientProvider>
);

export default App;