import { Card } from "@/components/ui/card";
import { 
  ClipboardList, 
  Eye,
  Activity,
  GitFork,
  Brain,
  Scale,
  Target,
  Workflow,
  FileText,
  Users,
  BarChart2,
  LineChart,
  PieChart,
  ChartBar,
  Shield,
  Gauge,
  FileBarChart,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Microscope
} from "lucide-react";
import { Link } from "react-router-dom";

const leanTools = [
  {
    title: "5S Vision",
    description: "AI-powered workspace organization and monitoring",
    icon: Eye,
    href: "/operations/lean/5s-vision",
    features: [
      "Computer vision analysis",
      "Automated cleanliness monitoring",
      "Pattern recognition",
      "Real-time compliance tracking"
    ]
  },
  {
    title: "Motion Analysis",
    description: "Advanced analytics for movement optimization",
    icon: Activity,
    href: "/operations/lean/motion-analysis",
    features: [
      "Video analytics",
      "Spaghetti diagrams",
      "Motion patterns",
      "Ergonomic assessment"
    ]
  },
  {
    title: "Process Mapping",
    description: "Visual process analysis and improvement",
    icon: Workflow,
    href: "/operations/lean/process-mapping",
    features: [
      "Value stream mapping",
      "Process documentation",
      "Bottleneck analysis",
      "Improvement tracking"
    ]
  },
  {
    title: "Kaizen Events",
    description: "Continuous improvement initiatives",
    icon: Target,
    href: "/operations/lean/kaizen",
    features: [
      "Event planning",
      "Team collaboration",
      "Results tracking",
      "Follow-up actions"
    ]
  },
  {
    title: "Standard Work",
    description: "Work standardization and documentation",
    icon: ClipboardList,
    href: "/operations/lean/standard-work",
    features: [
      "Work instructions",
      "Time studies",
      "Best practices",
      "Training materials"
    ]
  },
  {
    title: "Root Cause Analysis",
    description: "Problem-solving and analysis tools",
    icon: GitFork,
    href: "/operations/lean/root-cause",
    features: [
      "Five Whys",
      "Fishbone diagrams",
      "Pareto analysis",
      "Solution tracking"
    ]
  }
];

const Lean = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Lean Manufacturing</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {leanTools.map((tool) => (
          <Link 
            key={tool.title} 
            to={tool.href}
            className="block transition-transform duration-200 hover:scale-105"
          >
            <Card className="p-6 h-full">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <tool.icon className="h-8 w-8 text-primary shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                    <p className="text-muted-foreground">{tool.description}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground ml-4">
                  {tool.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Lean;