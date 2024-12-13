import { 
  Eye, 
  Activity
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const leanModules = [
  {
    title: "5S Vision",
    description: "AI-powered workspace organization and monitoring",
    icon: Eye,
    href: "/operations/lean/5s-vision",
    features: [
      "Computer vision analysis of workspace organization",
      "Automated cleanliness monitoring",
      "Pattern recognition for optimal tool placement",
      "Real-time compliance tracking"
    ],
    status: "ready"
  },
  {
    title: "Motion & Process Analysis",
    description: "Advanced analytics for movement and workflow optimization",
    icon: Activity,
    href: "/operations/lean/motion-analysis",
    features: [
      "Video analytics for worker movements",
      "Automated spaghetti diagrams",
      "Machine learning for optimal motion patterns",
      "Real-time ergonomic risk assessment"
    ],
    status: "coming-soon"
  }
];

const LeanManufacturing = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Activity className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Lean Manufacturing</h1>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {leanModules.map((module) => (
          <Link 
            key={module.title} 
            to={module.href}
            className={`transition-transform duration-200 hover:scale-105 ${
              module.status === "coming-soon" ? "pointer-events-none opacity-60" : ""
            }`}
          >
            <Card className="p-6 h-full">
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4">
                  <module.icon className="h-8 w-8 text-secondary shrink-0" />
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{module.title}</h3>
                    <p className="text-gray-600">{module.description}</p>
                  </div>
                </div>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600 ml-4">
                  {module.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
                {module.status === "coming-soon" && (
                  <span className="inline-block mt-2 text-sm bg-accent px-2 py-1 rounded self-start">
                    Coming Soon
                  </span>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default LeanManufacturing;