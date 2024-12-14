import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, Package, Bot } from "lucide-react";

const Desktop = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Use a small timeout to ensure component is mounted
    const timer = setTimeout(() => {
      navigate("/", { replace: true });
    }, 100);

    return () => clearTimeout(timer);
  }, [navigate]);

  return null; // Don't render anything since we're redirecting
};

export default Desktop;