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
    title: "Team Management",
    description: "Manage your team and assignments",
    icon: Users,
    href: "/team",
    status: "ready" as const
  },
  {
    title: "Training Matrix",
    description: "Track employee training and certifications",
    icon: GraduationCap,
    href: "/training/matrix",
    status: "ready" as const
  },
  {
    title: "Analytics",
    description: "Performance metrics and insights",
    icon: ChartBar,
    href: "/analytics",
    status: "coming-soon" as const
  },
  {
    title: "Data Management",
    description: "Manage and organize your data",
    icon: Database,
    href: "/data",
    status: "coming-soon" as const
  },
  {
    title: "Settings",
    description: "Configure your workspace",
    icon: Settings,
    href: "/settings",
    status: "coming-soon" as const
  },
  {
    title: "Operations",
    description: "Manage and optimize processes",
    icon: Building2,
    href: "/operations",
    status: "coming-soon" as const
  }
];

export const Dashboard = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Modules</h2>
      <div className="grid grid-cols-1 gap-4">
        {modules.map((module) => (
          <ModuleCard key={module.title} {...module} />
        ))}
      </div>
    </div>
  );
};