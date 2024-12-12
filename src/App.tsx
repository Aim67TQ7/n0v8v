import { Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AppProviders } from "@/components/AppProviders";
import { Header } from "@/components/Header";
import { routes } from "@/routes/routes";
import { AuthProvider } from "@/contexts/AuthContext";

const App = () => (
  <AppProviders>
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        {/* Only show header if not on CompanyGPT route */}
        <Routes>
          <Route
            path="/company-gpt"
            element={
              <main className="flex-1">
                <Routes>
                  {routes
                    .filter(route => route.path === '/company-gpt')
                    .map(route => (
                      <Route
                        key={route.path}
                        path="/"
                        element={route.element}
                      />
                    ))}
                </Routes>
              </main>
            }
          />
          <Route
            path="*"
            element={
              <>
                <Header />
                <main className="flex-1 container mx-auto px-4 py-8">
                  <Routes>
                    {routes
                      .filter(route => route.path !== '/company-gpt')
                      .map(route => (
                        <Route
                          key={route.path}
                          path={route.path}
                          element={route.element}
                        />
                      ))}
                  </Routes>
                </main>
              </>
            }
          />
        </Routes>
      </div>
      <Toaster />
      <Sonner />
    </AuthProvider>
  </AppProviders>
);

export default App;