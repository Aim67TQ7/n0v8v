import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Package, Mail, Settings } from "lucide-react";
import { useSessionContext } from "@supabase/auth-helpers-react";

export const Header = () => {
  const navigate = useNavigate();
  const { session } = useSessionContext();

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
            <Button variant="ghost" onClick={() => navigate("/contact")} className="gap-2">
              <Mail className="h-4 w-4" />
              Contact
            </Button>
            <Button variant="ghost" onClick={() => navigate("/settings")} className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </nav>

          {/* User Info */}
          <div className="flex items-center space-x-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{session?.user?.email}</span>
              <span className="ml-2 px-2 py-1 bg-gray-100 rounded-full text-xs">
                DEMO Company
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};