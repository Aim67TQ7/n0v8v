import { Eye, ClipboardList, Headset, Wrench, ShieldCheck, Factory, Package } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const modulesList = [
  {
    title: "5S Vision",
    description: "Visual workplace organization and standardization",
    icon: Eye,
    href: "/5svision",
    status: "coming-soon"
  },
  {
    title: "Process Documentation",
    description: "Create and manage standard operating procedures",
    icon: ClipboardList,
    href: "/processes",
    status: "coming-soon"
  },
  {
    title: "Operations Management",
    description: "Comprehensive operations control and optimization",
    icon: Factory,
    href: "/operations",
    status: "coming-soon",
    sections: [
      {
        title: "Customer Support",
        description: "Manage customer service operations",
        icon: Headset
      },
      {
        title: "Engineering",
        description: "Technical operations and development",
        icon: Wrench
      },
      {
        title: "Quality Assurance",
        description: "Quality control and testing processes",
        icon: ShieldCheck
      },
      {
        title: "Production",
        description: "Manufacturing and production management",
        icon: Factory
      },
      {
        title: "Supply Chain",
        description: "Supply chain and logistics management",
        icon: Package
      }
    ]
  }
];

const Modules = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <h1 className="text-3xl font-bold">Available Modules</h1>
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
                  {module.sections && (
                    <div className="mt-4 space-y-2">
                      {module.sections.map((section) => (
                        <div key={section.title} className="flex items-center gap-2 text-sm text-gray-500">
                          <section.icon className="h-4 w-4" />
                          <span>{section.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
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

export default Modules;