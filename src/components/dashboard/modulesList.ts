import { Bot, Building2, FileSpreadsheet, Microscope, Network, Settings2, Users2, Globe } from "lucide-react";
import { ModuleCardProps } from "./ModuleCard";

export const modulesList: ModuleCardProps[] = [
  {
    title: "Company GPT",
    description: "Chat with your AI assistant trained on your company data",
    icon: Bot,
    href: "/company-gpt",
    status: "ready"
  },
  {
    title: "Team Management",
    description: "Manage your team members, departments and locations",
    icon: Users2,
    href: "/team",
    status: "ready"
  },
  {
    title: "Operations",
    description: "Manage your operations, quality, and maintenance",
    icon: Settings2,
    href: "/operations/lean",
    status: "ready"
  },
  {
    title: "Training Matrix",
    description: "Track and manage employee training and certifications",
    icon: FileSpreadsheet,
    href: "/training/matrix",
    status: "ready"
  },
  {
    title: "Lead Generation",
    description: "Web scraping tools for automated lead generation",
    icon: Globe,
    href: "/leads/scraping",
    status: "ready"
  },
];
