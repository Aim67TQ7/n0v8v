import { AppWindow, Building, FileSpreadsheet, PackageSearch, Scale, ScrollText, Users2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface AppCardProps {
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  href: string;
  isWorking: boolean;
}

const AppCard = ({ title, description, icon: Icon, href, isWorking }: AppCardProps) => (
  <Link 
    to={href}
    className={cn(
      "block transition-transform duration-200 hover:scale-105",
      !isWorking && "pointer-events-none opacity-60"
    )}
  >
    <Card className="p-6 h-full">
      <div className="flex items-start gap-4">
        <Icon className="h-6 w-6 text-primary shrink-0 mt-1" />
        <div>
          <h3 className="font-semibold text-lg">{title}</h3>
          <p className="text-muted-foreground mt-1">{description}</p>
          {!isWorking && (
            <span className="inline-block mt-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
              Coming Soon
            </span>
          )}
        </div>
      </div>
    </Card>
  </Link>
);

const apps: AppCardProps[] = [
  {
    title: "5S Vision Tool",
    description: "AI-powered visual workplace organization assessment and tracking",
    icon: Scale,
    href: "/operations/lean/5s-vision",
    isWorking: true,
  },
  {
    title: "Part Analysis Tool",
    description: "Visual inspection and analysis system for part quality",
    icon: PackageSearch,
    href: "/operations/quality/part-analysis",
    isWorking: true,
  },
  {
    title: "Process Analysis",
    description: "Analyze and optimize manufacturing processes",
    icon: PackageSearch,
    href: "/operations/process",
    isWorking: true,
  },
  {
    title: "Training Matrix",
    description: "Track employee training and certifications",
    icon: FileSpreadsheet,
    href: "/training/matrix",
    isWorking: true,
  },
  {
    title: "Company GPT",
    description: "AI-powered assistant for your organization",
    icon: Building,
    href: "/company-gpt",
    isWorking: true,
  },
  {
    title: "Documentation",
    description: "Manage and access company documentation",
    icon: ScrollText,
    href: "/documentation",
    isWorking: false,
  }
];

const Apps = () => {
  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center gap-2 mb-6">
        <AppWindow className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Manufacturing Tools</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {apps.map((app) => (
          <AppCard key={app.title} {...app} />
        ))}
      </div>
    </div>
  );
};

export default Apps;