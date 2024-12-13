import { Bot, Building2, FileSpreadsheet, Settings2, Users2, Building } from "lucide-react";
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
    title: "Vertical Agents",
    description: "Industry-specific AI agents for customer engagement",
    icon: Building,
    href: "/vertical-agents",
    status: "coming-soon"
  }
];