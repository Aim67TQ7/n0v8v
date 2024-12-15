import { 
  Calendar, 
  Activity, 
  Gauge, 
  BarChart2, 
  MonitorPlay,
  Users,
  AlertTriangle
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const modules = [
  {
    title: "Production Planning",
    description: "Schedule and plan production activities with advanced forecasting tools",
    icon: Calendar,
    href: "/operations/production/planning",
    status: "ready"
  },
  {
    title: "Real-time Tracking",
    description: "Monitor production progress and KPIs in real-time",
    icon: Activity,
    href: "/operations/production/tracking",
    status: "ready"
  },
  {
    title: "Capacity Planning",
    description: "Analyze and optimize production capacity across workcenters",
    icon: Gauge,
    href: "/operations/production/capacity",
    status: "ready"
  },
  {
    title: "Bottleneck Analysis",
    description: "Identify and resolve production bottlenecks",
    icon: BarChart2,
    href: "/operations/production/bottlenecks",
    status: "ready"
  },
  {
    title: "Equipment Monitoring",
    description: "Real-time monitoring of equipment status and performance",
    icon: MonitorPlay,
    href: "/operations/production/equipment",
    status: "ready"
  },
  {
    title: "Labor Efficiency",
    description: "Track and optimize workforce productivity",
    icon: Users,
    href: "/operations/production/labor",
    status: "ready"
  },
  {
    title: "Shortage Prediction",
    description: "AI-powered analytics to predict and prevent material shortages",
    icon: AlertTriangle,
    href: "/operations/production/shortages",
    status: "ready"
  }
];

const Production = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Production Management</h1>
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
                    <span className="inline-block mt-2 text-sm bg-accent px-2 py-1 rounded">
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

export default Production;