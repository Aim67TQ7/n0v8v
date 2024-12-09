import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface ModuleCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: "ready" | "coming-soon";
}

export const ModuleCard = ({ title, description, icon: Icon, href, status }: ModuleCardProps) => {
  return (
    <Link 
      to={href}
      className={`transition-transform duration-200 hover:scale-105 ${
        status === "coming-soon" ? "pointer-events-none opacity-60" : ""
      }`}
    >
      <Card className="p-3">
        <div className="flex items-center gap-3">
          <Icon className="h-5 w-5 text-secondary shrink-0" />
          <div className="min-w-0">
            <h3 className="text-sm font-medium truncate">{title}</h3>
            <p className="text-xs text-muted-foreground truncate">{description}</p>
          </div>
        </div>
        {status === "coming-soon" && (
          <span className="inline-block mt-1 text-xs bg-accent px-1.5 py-0.5 rounded">
            Coming Soon
          </span>
        )}
      </Card>
    </Link>
  );
};