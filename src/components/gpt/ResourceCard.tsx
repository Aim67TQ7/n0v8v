import { ExternalLink, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";

interface ResourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  onClick?: () => void;
}

export const ResourceCard = ({ icon: Icon, title, description, onClick }: ResourceCardProps) => {
  return (
    <Card 
      className="p-4 hover:bg-accent cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-center gap-2">
        <Icon className="h-5 w-5" />
        <div>
          <h3 className="font-medium">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ExternalLink className="h-4 w-4 ml-auto" />
      </div>
    </Card>
  );
};