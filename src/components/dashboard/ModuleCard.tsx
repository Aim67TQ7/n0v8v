import { LucideIcon } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";

export interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: "ready" | "coming-soon";
}

export const ModuleCard = ({ title, description, icon: Icon, href, status }: ModuleCardProps) => {
  const navigate = useNavigate();

  const handleClick = () => {
    if (status === "ready") {
      navigate(href);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`block transition-transform duration-200 hover:scale-105 ${
        status === "coming-soon" ? "pointer-events-none opacity-60" : "cursor-pointer"
      }`}
    >
      <Card className="p-4 h-full">
        <div className="flex items-start gap-3">
          <Icon className="h-5 w-5 text-secondary shrink-0 mt-1" />
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
            {status === "coming-soon" && (
              <span className="inline-block mt-2 text-xs bg-accent px-2 py-1 rounded">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};