import { 
  Users, 
  Wrench, 
  ShieldCheck, 
  Factory, 
  Package, 
  ChartBar,
  Shield,
  Search
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const modulesList = [
  {
    title: "Customer Focus",
    description: "Manage customer relationships and service excellence",
    icon: Users,
    href: "/operations/customer-focus",
    status: "ready"
  },
  {
    title: "Engineering",
    description: "Technical operations and development processes",
    icon: Wrench,
    href: "/operations/engineering",
    status: "coming-soon"
  },
  {
    title: "Quality Assurance",
    description: "Quality control and testing processes",
    icon: ShieldCheck,
    href: "/operations/quality",
    status: "ready"
  },
  {
    title: "Production",
    description: "Manufacturing and production management",
    icon: Factory,
    href: "/operations/production",
    status: "coming-soon"
  },
  {
    title: "Supply Chain",
    description: "Supply chain and logistics management",
    icon: Package,
    href: "/operations/supply-chain",
    status: "coming-soon"
  },
  {
    title: "Lean Manufacturing",
    description: "Optimize processes and reduce waste",
    icon: ChartBar,
    href: "/operations/lean",
    status: "ready"
  },
  {
    title: "Compliance",
    description: "Regulatory compliance and standards",
    icon: Shield,
    href: "/operations/compliance",
    status: "coming-soon"
  }
];

const customerFocusTools = [
  {
    title: "Lead Generation",
    description: "Web scraping tools for automated lead generation",
    icon: Search,
    href: "/leads/scraping",
    status: "ready"
  }
];

const Modules = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <Factory className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Operations Management</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modulesList.map((module) => (
          <Link 
            key={module.title} 
            to={module.href}
            className={`transition-transform duration-200 hover:scale-105 ${
              module.status === "coming-soon" ? "pointer-events-none opacity-60" : ""
            }`}
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

      {window.location.pathname === '/operations/customer-focus' && (
        <>
          <div className="flex items-center gap-3 my-8">
            <Users className="h-8 w-8 text-secondary" />
            <h2 className="text-2xl font-bold">Customer Focus Tools</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {customerFocusTools.map((tool) => (
              <Link 
                key={tool.title} 
                to={tool.href}
                className="transition-transform duration-200 hover:scale-105"
              >
                <Card className="p-6 h-full">
                  <div className="flex items-start gap-4">
                    <tool.icon className="h-8 w-8 text-secondary shrink-0" />
                    <div>
                      <h3 className="text-xl font-semibold mb-2">{tool.title}</h3>
                      <p className="text-gray-600">{tool.description}</p>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Modules;