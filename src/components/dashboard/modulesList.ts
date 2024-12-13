import { Bot, Building2, Building, ChartBar } from "lucide-react";
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
    title: "Modules",
    description: "Access all organizational modules and functions",
    icon: Building2,
    href: "/modules",
    status: "ready"
  },
  {
    title: "Company Metrics",
    description: "View and analyze key performance indicators",
    icon: ChartBar,
    href: "/metrics",
    status: "coming-soon"
  },
  {
    title: "Vertical Agents",
    description: "Industry-specific AI agents for customer engagement",
    icon: Building,
    href: "/vertical-agents",
    status: "coming-soon"
  }
];