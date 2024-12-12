import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  Database,
  ChartBar,
  Building2,
  GraduationCap,
  MessageSquare,
  ChevronDown,
  AppWindow
} from "lucide-react";
import { ModuleCard } from "./dashboard/ModuleCard";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";
import { Button } from "./ui/button";

const modules = [
  {
    title: "Apps",
    description: "Access your licensed applications",
    icon: AppWindow,
    href: "/apps",
    status: "ready" as const
  },
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
    title: "Company GPT",
    description: "Chat with your AI assistant",
    icon: MessageSquare,
    href: "/company-gpt",
    status: "ready" as const
  },
  {
    title: "Data Management",
    description: "Manage and organize your data",
    icon: Database,
    href: "/data",
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
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="space-y-4 p-4">
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="bg-white rounded-lg border shadow-sm"
      >
        <CollapsibleTrigger asChild>
          <Button
            variant="ghost"
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
          >
            <div className="flex items-center gap-2">
              <LayoutDashboard className="h-5 w-5 text-secondary" />
              <h2 className="text-lg font-semibold">Available Modules</h2>
            </div>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${
                isOpen ? "transform rotate-180" : ""
              }`}
            />
          </Button>
        </CollapsibleTrigger>
        <CollapsibleContent className="p-4 pt-0 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {modules.map((module) => (
              <ModuleCard key={module.title} {...module} />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};