import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Package, Mail, Users, Settings } from "lucide-react";

export const NavigationLinks = () => {
  const navigate = useNavigate();
  
  const openOutlook = () => {
    window.location.href = "mailto:";
  };

  const openTeams = () => {
    window.location.href = "msteams:/";
  };

  return (
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
  );
};