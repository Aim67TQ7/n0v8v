import { 
  Building2, 
  MapPin, 
  Users, 
  Factory,
  UserCircle,
  Package,
  Database,
  Building,
  Folder
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

const modulesList = [
  {
    title: "Company",
    description: "Manage company information and settings",
    icon: Building,
    href: "/team/company",
    status: "ready"
  },
  {
    title: "Locations",
    description: "Manage facility locations",
    icon: MapPin,
    href: "/team/locations",
    status: "ready"
  },
  {
    title: "Departments",
    description: "Organize and manage departments",
    icon: Building2,
    href: "/team/departments",
    status: "ready"
  },
  {
    title: "Work Centers",
    description: "Configure work centers and stations",
    icon: Factory,
    href: "/team/workcenters",
    status: "ready"
  },
  {
    title: "Employees",
    description: "Manage employee information and roles",
    icon: Users,
    href: "/team/employees",
    status: "ready"
  },
  {
    title: "Categories",
    description: "Manage product categories and assignments",
    icon: Folder,
    href: "/team/categories",
    status: "ready"
  },
  {
    title: "Part Classes",
    description: "Define and manage part classifications",
    icon: Package,
    href: "/team/part-classes",
    status: "ready"
  },
  {
    title: "Part Numbers",
    description: "Manage part numbers and details",
    icon: Database,
    href: "/team/part-numbers",
    status: "ready"
  }
];

const TeamManagement = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <UserCircle className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Team Management</h1>
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
    </div>
  );
};

export default TeamManagement;