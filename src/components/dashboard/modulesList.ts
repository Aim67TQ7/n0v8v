import { 
  AppWindow,
  Users, 
  Settings, 
  Database,
  ChartBar,
  Building2,
  GraduationCap,
  MessageSquare,
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Module {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: "ready" | "coming-soon";
}

export const modulesList: Module[] = [
  {
    title: "Tools",
    description: "Access your licensed tools",
    icon: AppWindow,
    href: "/apps",
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
    description: "Chat with your AI assistant",
    icon: MessageSquare,
    href: "/company-gpt",
    status: "ready"
  },
  {
    title: "Data Management",
    description: "Manage and organize your data",
    icon: Database,
    href: "/data",
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
    title: "Settings",
    description: "Configure your workspace",
    icon: Settings,
    href: "/settings",
    status: "coming-soon"
  },
  {
    title: "Operations",
    description: "Manage and optimize processes",
    icon: Building2,
    href: "/operations",
    status: "coming-soon"
  }
];