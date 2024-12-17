import { FileText, TrendingUp, Search, ChartBar } from "lucide-react";
import type { ModuleCardProps } from "../ModuleCard";

export const marketingModules: ModuleCardProps[] = [
  {
    title: "Market Research",
    description: "Generate comprehensive market research reports with AI assistance",
    icon: FileText,
    href: "/marketing/research",
    status: "ready"
  },
  {
    title: "Marketing Analytics",
    description: "Track and analyze marketing performance metrics",
    icon: TrendingUp,
    href: "/marketing/analytics",
    status: "coming-soon"
  }
];