import { Card } from "@/components/ui/card";
import { 
  ClipboardList, 
  BarChart2, 
  LineChart, 
  Users, 
  FileText, 
  PieChart,
  ChartBar,
  Brain,
  Shield,
  Scale,
  Target,
  Workflow,
  Gauge,
  Activity,
  FileBarChart,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Microscope,
  GitFork
} from "lucide-react";

const Lean = () => {
  const sixSigmaPhases = [
    {
      title: "Define",
      description: "Define the Problem or Issue",
      items: [
        { name: "Problem Definition", icon: ClipboardList, description: "Clear identification of the issue" },
        { name: "Project Charter", icon: FileText, description: "Project scope and objectives" },
        { name: "Voice of Customer", icon: Users, description: "Customer requirements and feedback" },
        { name: "Problem Statement", icon: AlertTriangle, description: "Detailed problem description" },
        { name: "Process Map", icon: Workflow, description: "Visual representation of the process" }
      ]
    },
    {
      title: "Measure",
      description: "Collect Key Data",
      items: [
        { name: "Critical to Quality Metrics", icon: Target, description: "Key quality indicators" },
        { name: "Measurement System & Analysis", icon: Microscope, description: "Data collection methods" },
        { name: "Statistics", icon: BarChart2, description: "Statistical analysis of data" },
        { name: "Processes", icon: GitFork, description: "Process documentation" },
        { name: "Control Methods & Charts", icon: LineChart, description: "Process control tools" }
      ]
    },
    {
      title: "Analyze",
      description: "Find Root Causes",
      items: [
        { name: "Pareto Chart", icon: ChartBar, description: "80/20 rule analysis" },
        { name: "Run Chart", icon: Activity, description: "Process performance over time" },
        { name: "Cause & Effect", icon: GitFork, description: "Root cause analysis" },
        { name: "Scatter Diagram", icon: PieChart, description: "Variable relationship analysis" },
        { name: "Value Analysis", icon: Scale, description: "Value stream mapping" }
      ]
    },
    {
      title: "Improve",
      description: "Identify the Best Solution",
      items: [
        { name: "Brainstorms", icon: Brain, description: "Solution generation" },
        { name: "Benchmarks", icon: Target, description: "Industry best practices" },
        { name: "Force Field Analysis", icon: Scale, description: "Change impact analysis" },
        { name: "Criteria & Tests", icon: CheckCircle2, description: "Solution validation" },
        { name: "FMEA", icon: AlertTriangle, description: "Failure mode analysis" }
      ]
    },
    {
      title: "Control",
      description: "Sustain the Gains",
      items: [
        { name: "Process Controls", icon: Gauge, description: "Control mechanisms" },
        { name: "Control Plan", icon: Shield, description: "Sustainability planning" },
        { name: "Cost Benefit Analysis", icon: FileBarChart, description: "Financial impact analysis" },
        { name: "Mistake Proofing", icon: Shield, description: "Error prevention" },
        { name: "Risk Mitigation", icon: AlertTriangle, description: "Risk management strategies" }
      ]
    }
  ];

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Lean Operations</h1>
      
      <div className="space-y-8">
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Lean Six Sigma Tools</h2>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {sixSigmaPhases.map((phase) => (
              <div key={phase.title} className="space-y-4">
                <div className="bg-primary/10 p-4 rounded-lg">
                  <h3 className="font-semibold text-lg mb-1">{phase.title}</h3>
                  <p className="text-sm text-muted-foreground">{phase.description}</p>
                </div>
                <div className="space-y-3">
                  {phase.items.map((item) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={item.name}
                        className="flex items-start gap-3 p-3 bg-card hover:bg-accent/10 rounded-lg transition-colors cursor-pointer"
                      >
                        <Icon className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-sm">{item.name}</h4>
                          <p className="text-xs text-muted-foreground">{item.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Lean;