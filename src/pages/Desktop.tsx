import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Package, Bot } from "lucide-react";

const Desktop = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Immediately redirect to hub
    navigate("/");
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="p-6 bg-white shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Redirecting to Hub...</h1>
        
        <div className="grid gap-4">
          <Button 
            variant="default" 
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => navigate("/")}
          >
            <Home className="h-4 w-4" />
            Go to Hub
          </Button>

          <Button 
            variant="default" 
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => navigate("/company-gpt")}
          >
            <Bot className="h-4 w-4" />
            CompanyGPT
          </Button>

          <Button 
            variant="default" 
            className="w-full flex items-center gap-2 justify-center"
            onClick={() => navigate("/modules")}
          >
            <Package className="h-4 w-4" />
            Modules
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Desktop;