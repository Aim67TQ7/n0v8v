import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Package, Mail, Users, Settings, ChevronDown, Bot, Wrench, Home } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";
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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-[1280px] px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/company-hub")} 
              className="gap-2"
            >
              <Home className="h-4 w-4" />
              HUB
            </Button>
            
            <Button 
              variant="ghost" 
              onClick={() => navigate("/tools")} 
              className="gap-2"
            >
              <Wrench className="h-4 w-4" />
              Tools
            </Button>

            <Button 
              variant="ghost" 
              onClick={() => navigate("/agents")} 
              className="gap-2"
            >
              <Bot className="h-4 w-4" />
              Agents
            </Button>
            
            {session ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/modules")} 
                  className="gap-2"
                >
                  <Package className="h-4 w-4" />
                  Modules
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={openOutlook} 
                  className="gap-2"
                >
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={openTeams} 
                  className="gap-2"
                >
                  <Users className="h-4 w-4" />
                  Teams
                </Button>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate("/settings")} 
                  className="gap-2"
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              </>
            ) : null}
          </nav>

          {/* User Info */}
          <div className="flex items-center gap-6">
            {session && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end">
                  <span className="text-sm font-medium">
                    {session.user.email}
                  </span>
                  <span className="text-xs px-2 py-1 bg-muted rounded-full">
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
            )}
          </div>
        </div>
      </div>
    </header>
  );
};