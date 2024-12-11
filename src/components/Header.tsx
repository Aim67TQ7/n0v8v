import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Package, Mail, Users, Settings, LogOut, User, Key, UserPlus, ChevronDown } from "lucide-react";
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
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Navigation Links */}
          <nav className="flex items-center space-x-4">
            <Button variant="ghost" onClick={() => navigate("/")} className="gap-2">
              <Home className="h-4 w-4" />
              Home
            </Button>
            <Button variant="ghost" onClick={() => navigate("/modules")} className="gap-2">
              <Package className="h-4 w-4" />
              Modules
            </Button>
            <Button variant="ghost" onClick={openOutlook} className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </Button>
            <Button variant="ghost" onClick={openTeams} className="gap-2">
              <Users className="h-4 w-4" />
              Teams
            </Button>
            <Button variant="ghost" onClick={() => navigate("/settings")} className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          {/* API Status Indicators and User Info */}
          <div className="flex items-center gap-6">
            <ApiStatus />
            <div className="flex items-center gap-4">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded-md">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-medium text-gray-900">
                        {session?.user?.email}
                      </span>
                      <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                        DEMO Company
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  {!session ? (
                    <DropdownMenuItem onClick={() => navigate("/login")}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Login</span>
                    </DropdownMenuItem>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/change-password")}>
                        <Key className="mr-2 h-4 w-4" />
                        <span>Change Password</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/invite")}>
                        <UserPlus className="mr-2 h-4 w-4" />
                        <span>Invite Others</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Logout</span>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};