import { ExternalLink, LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

interface ResourceCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  href?: string;
  onClick?: () => void;
}

export const ResourceCard = ({ icon: Icon, title, description, href, onClick }: ResourceCardProps) => {
  const navigate = useNavigate();
  
  const handleClick = () => {
    if (href) {
      navigate(href);
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <Card 
      className="p-4 hover:bg-accent cursor-pointer transition-colors"
      onClick={handleClick}
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