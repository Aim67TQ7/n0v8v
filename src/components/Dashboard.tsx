import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database,
  ChartBar,
  Building2,
  GraduationCap,
  MessageSquare
} from "lucide-react";
import { ModuleCard } from "./dashboard/ModuleCard";

const modules = [
  {
    title: "Modules",
    description: "Overview of available modules and features",
    icon: LayoutDashboard,
    href: "/modules",
    status: "ready"
  },
  {
    title: "Team Management",
    description: "Manage your team and assignments",
    icon: Users,
    href: "/team",
    status: "ready"
  },
  {
    title: "Training Matrix",
    description: "Track employee training and certifications",
    icon: GraduationCap,
    href: "/training/matrix",
    status: "ready"
  },
  {
    title: "Company GPT",
    description: "AI-powered assistant for your company",
    icon: MessageSquare,
    href: "/company-gpt",
    status: "ready"
  },
  {
    title: "Analytics",
    description: "Performance metrics and insights",
    icon: ChartBar,
    href: "/analytics",
    status: "coming-soon"
  },
  {
    title: "Data Management",
    description: "Manage and organize your data",
    icon: Database,
    href: "/data",
    status: "coming-soon"
  },
  {
    title: "Settings",
    description: "Configure your workspace",
    icon: Settings,
    href: "/settings",
    status: "coming-soon"
  },
  {
    title: "Operations Management",
    description: "Manage and optimize operational processes",
    icon: Building2,
    href: "/operations",
    status: "coming-soon"
  }
];

export const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <LayoutDashboard className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </div>
    </div>
  );
};