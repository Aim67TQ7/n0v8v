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
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const tools = [
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

const Tools = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Scale className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Manufacturing Tools</h1>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tools.map((tool) => (
          <Link 
            key={tool.title} 
            to={tool.href}
            className="block transition-transform duration-200 hover:scale-105"
          >
            <Card className="p-6 h-full">
              <div className="flex items-start gap-4">
                <tool.icon className="h-6 w-6 text-primary shrink-0 mt-1" />
                <div>
                  <h3 className="font-semibold text-lg">{tool.title}</h3>
                  <p className="text-muted-foreground mt-1">{tool.description}</p>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Tools;