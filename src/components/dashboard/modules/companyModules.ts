import { Bot, ChartBar } from "lucide-react";
import type { ModuleCardProps } from "../ModuleCard";

export const companyModules: ModuleCardProps[] = [
  {
    title: "Company GPT",
    description: "Chat with your AI assistant trained on your company data",
    icon: Bot,
    href: "/company-gpt",
    status: "ready"
  },
  {
    title: "Company Metrics",
    description: "View and analyze key performance indicators",
    icon: ChartBar,
    href: "/metrics",
    status: "coming-soon"
  }
];