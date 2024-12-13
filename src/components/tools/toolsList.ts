import { 
  Eye, 
  Activity, 
  Calculator,
  FileSpreadsheet,
  MessageSquare,
  PackageSearch,
  Scale,
  Microscope,
  GitFork,
  Fish,
  Wrench,
  BookOpen
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: "ready" | "coming-soon";
}

export const tools: Tool[] = [
  {
    title: "5S Vision Tool",
    description: "AI-powered visual workplace organization assessment and tracking",
    icon: Eye,
    href: "/operations/lean/5s-vision",
    status: "ready" as const
  },
  {
    title: "AI Maintenance",
    description: "AI-powered preventative maintenance system",
    icon: Wrench,
    href: "/operations/maintenance",
    status: "ready" as const
  },
  {
    title: "Company GPT",
    description: "Chat with your AI assistant for process improvement insights",
    icon: MessageSquare,
    href: "/company-gpt",
    status: "ready" as const
  },
  {
    title: "Five Whys Analysis",
    description: "AI-guided root cause analysis tool",
    icon: GitFork,
    href: "/operations/quality/five-whys",
    status: "ready" as const
  },
  {
    title: "Fishbone Analysis",
    description: "Structured cause-and-effect analysis tool",
    icon: Fish,
    href: "/operations/quality/fishbone",
    status: "ready" as const
  },
  {
    title: "Part Analysis",
    description: "Visual inspection and analysis system for part quality",
    icon: PackageSearch,
    href: "/operations/quality/part-analysis",
    status: "ready" as const
  },
  {
    title: "Process Analysis",
    description: "Analyze and optimize manufacturing processes",
    icon: Activity,
    href: "/operations/process",
    status: "ready" as const
  },
  {
    title: "Product Inspection",
    description: "Automated visual inspection and pass/fail analysis",
    icon: Microscope,
    href: "/operations/quality/product-inspection",
    status: "ready" as const
  },
  {
    title: "Training Matrix",
    description: "Track employee training and certifications",
    icon: FileSpreadsheet,
    href: "/operations/hr/training-matrix",
    status: "ready" as const
  },
  {
    title: "VAVE Analysis",
    description: "Value Analysis and Value Engineering with AI assistance",
    icon: Calculator,
    href: "/operations/engineering/vave-analysis",
    status: "ready" as const
  }
].sort((a, b) => a.title.localeCompare(b.title));