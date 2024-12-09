import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { Home, Package, Mail, Settings, LogOut, User, ChevronDown } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const Header = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();
  
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          company:companies(
            name,
            license_type
          )
        `)
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50">
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
            <Button variant="ghost" onClick={() => navigate("/contact")} className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </Button>
            <Button variant="ghost" onClick={() => navigate("/settings")} className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          {/* User Info, Theme Toggle & Logout */}
          <div className="flex items-center space-x-4">
            {profile && (
              <div className="flex items-center gap-3">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="gap-2 font-semibold text-foreground hover:bg-accent"
                    >
                      <User className="h-4 w-4 text-foreground" />
                      <span className="text-foreground">
                        {profile.first_name} {profile.last_name}
                      </span>
                      <ChevronDown className="h-4 w-4 text-foreground" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="font-medium text-foreground">Company</span>
                      <span className="text-sm text-foreground/80">{profile.company?.name}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="font-medium text-foreground">Role</span>
                      <span className="text-sm text-foreground/80 capitalize">{profile.role}</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="flex flex-col items-start gap-1">
                      <span className="font-medium text-foreground">Plan</span>
                      <span className="text-sm text-foreground/80 capitalize">{profile.company?.license_type}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="gap-2 text-red-500 focus:text-red-500 focus:bg-red-50" 
                      onClick={handleLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <ThemeToggle />
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};