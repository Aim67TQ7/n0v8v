import { 
  Eye, 
  Activity, 
  Calculator,
  FileSpreadsheet,
  MessageSquare,
  PackageSearch,
  Scale,
  Microscope,
  GitFork
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
    status: "ready"
  },
  {
    title: "Company GPT",
    description: "Chat with your AI assistant for process improvement insights",
    icon: MessageSquare,
    href: "/company-gpt",
    status: "ready"
  },
  {
    title: "Five Whys Analysis",
    description: "AI-guided root cause analysis tool",
    icon: GitFork,
    href: "/operations/quality/five-whys",
    status: "ready"
  },
  {
    title: "Part Analysis",
    description: "Visual inspection and analysis system for part quality",
    icon: PackageSearch,
    href: "/operations/quality/part-analysis",
    status: "ready"
  },
  {
    title: "Process Analysis",
    description: "Analyze and optimize manufacturing processes",
    icon: Activity,
    href: "/operations/process",
    status: "ready"
  },
  {
    title: "Product Inspection",
    description: "Automated visual inspection and pass/fail analysis",
    icon: Microscope,
    href: "/operations/quality/product-inspection",
    status: "ready"
  },
  {
    title: "Training Matrix",
    description: "Track employee training and certifications",
    icon: FileSpreadsheet,
    href: "/training/matrix",
    status: "ready"
  },
  {
    title: "VAVE Analysis",
    description: "Value Analysis and Value Engineering with AI assistance",
    icon: Calculator,
    href: "/operations/lean/vave-analysis",
    status: "ready"
  }
].sort((a, b) => a.title.localeCompare(b.title));