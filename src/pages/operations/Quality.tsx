import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Microscope, 
  ClipboardCheck, 
  FileWarning, 
  GitFork,
  Fish,
  Scale,
  FileSpreadsheet,
  BarChart2
} from "lucide-react";

const modules = [
  {
    title: "Part Analysis",
    description: "AI-powered quality analysis and process optimization",
    icon: Microscope,
    href: "/operations/quality/part-analysis",
    status: "ready"
  },
  {
    title: "Product Inspection",
    description: "Automated visual inspection and pass/fail analysis",
    icon: ClipboardCheck,
    href: "/operations/quality/product-inspection",
    status: "ready"
  },
  {
    title: "DMR Documentation",
    description: "Track and analyze discrepancy reports",
    icon: FileWarning,
    href: "/operations/quality/dmr",
    status: "ready"
  },
  {
    title: "Five Whys Analysis",
    description: "AI-guided root cause analysis",
    icon: GitFork,
    href: "/operations/quality/five-whys",
    status: "ready"
  },
  {
    title: "Fishbone Analysis",
    description: "Cause and effect analysis using Fishbone diagram",
    icon: Fish,
    href: "/operations/quality/fishbone",
    status: "ready"
  },
  {
    title: "Process Improvement",
    description: "Visual process analysis and improvement tracking",
    icon: BarChart2,
    href: "/operations/quality/process-improvement",
    status: "ready"
  },
  {
    title: "VAVE Analysis",
    description: "Value analysis and value engineering tools",
    icon: Scale,
    href: "/operations/quality/vave",
    status: "ready"
  },
  {
    title: "Quality Metrics",
    description: "Track and analyze key quality indicators",
    icon: FileSpreadsheet,
    href: "/operations/quality/metrics",
    status: "ready"
  }
];

const Quality = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <ClipboardCheck className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Quality Assurance</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map((module) => (
          <Link 
            key={module.title} 
            to={module.href}
            className="transition-transform duration-200 hover:scale-105"
          >
            <Card className="p-6 h-full">
              <div className="flex items-start gap-4">
                <module.icon className="h-8 w-8 text-secondary shrink-0" />
                <div>
                  <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                  <p className="text-gray-600">{module.description}</p>
                  {module.status === "coming-soon" && (
                    <span className="inline-block mt-2 text-xs bg-accent px-2 py-1 rounded">
                      Coming Soon
                    </span>
                  )}
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Quality;