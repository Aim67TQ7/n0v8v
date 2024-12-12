import { LucideIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
}

export const ToolCard = ({ title, description, icon: Icon, href }: ToolCardProps) => {
  return (
    <Link 
      to={href}
      className="block transition-transform duration-200 hover:scale-105"
    >
      <Card className="p-6 h-full">
        <div className="flex items-start gap-4">
          <Icon className="h-6 w-6 text-primary shrink-0 mt-1" />
          <div>
            <h3 className="font-semibold text-lg">{title}</h3>
            <p className="text-muted-foreground mt-1">{description}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
};