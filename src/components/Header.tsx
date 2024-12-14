import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Package, Mail, Users, Settings, ChevronDown, Bot } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { ApiStatus } from "@/components/gpt/ApiStatus";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

  const openOutlook = () => {
    window.location.href = "mailto:";
  };

  const openTeams = () => {
    window.location.href = "msteams:/";
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-100 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/company-gpt")} 
              className="gap-2 text-gray-600 hover:text-gray-900"
            >
              <Bot className="h-4 w-4" />
              CompanyGPT
            </Button>
            
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2 text-gray-600 hover:text-gray-900">
              <Home className="h-4 w-4" />
              Home
            </Button>
            
            {session ? (
              // Show these links only for authenticated users
              <>
                <Button variant="ghost" onClick={() => navigate("/modules")} className="gap-2 text-gray-600 hover:text-gray-900">
                  <Package className="h-4 w-4" />
                  Modules
                </Button>
                <Button variant="ghost" onClick={openOutlook} className="gap-2 text-gray-600 hover:text-gray-900">
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
                <Button variant="ghost" onClick={openTeams} className="gap-2 text-gray-600 hover:text-gray-900">
                  <Users className="h-4 w-4" />
                  Teams
                </Button>
                <Button variant="ghost" onClick={() => navigate("/settings")} className="gap-2 text-gray-600 hover:text-gray-900">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </>
            ) : null}
          </nav>

          {/* API Status Indicators and User Info */}
          <div className="flex items-center gap-6">
            <ApiStatus />
            {session ? (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium text-gray-900">
                    {session.user.email}
                  </span>
                  <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                    DEMO Company
                  </span>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Button
                variant="default"
                onClick={() => navigate("/login")}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};