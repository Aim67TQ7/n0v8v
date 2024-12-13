import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

export interface ModuleCardProps {
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
      <Card className="p-6 h-full">
        <div className="flex items-start gap-4">
          <Icon className="h-8 w-8 text-secondary shrink-0" />
          <div>
            <h3 className="text-xl font-semibold mb-2">{title}</h3>
            <p className="text-gray-600">{description}</p>
            {status === "coming-soon" && (
              <span className="inline-block mt-2 text-sm bg-accent px-2 py-1 rounded">
                Coming Soon
              </span>
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};