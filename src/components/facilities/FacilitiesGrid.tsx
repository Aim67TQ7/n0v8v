import { ModuleCard } from "@/components/operations/ModuleCard";
import { Database, ClipboardList, Calendar, Package, Building2, Wrench, Warehouse, Construction } from "lucide-react";

const facilitiesModules = [
  {
    title: "Asset Tracking",
    description: "Track and manage facility assets, equipment, and resources",
    icon: Database,
    href: "/operations/facilities/assets",
    status: "ready" as const
  },
  {
    title: "Work Orders",
    description: "Create and manage maintenance work orders and requests",
    icon: ClipboardList,
    href: "/operations/facilities/work-orders",
    status: "ready" as const
  },
  {
    title: "Preventive Maintenance",
    description: "Schedule and track routine maintenance activities",
    icon: Calendar,
    href: "/operations/facilities/maintenance",
    status: "ready" as const
  },
  {
    title: "Equipment History",
    description: "Access equipment documentation and maintenance history",
    icon: Wrench,
    href: "/operations/facilities/equipment",
    status: "ready" as const
  },
  {
    title: "Inventory Control",
    description: "Manage spare parts and maintenance supplies inventory",
    icon: Package,
    href: "/operations/facilities/inventory",
    status: "ready" as const
  },
  {
    title: "Building Management",
    description: "Manage building systems and infrastructure",
    icon: Building2,
    href: "/operations/facilities/buildings",
    status: "ready" as const
  },
  {
    title: "Warehouse Operations",
    description: "Manage warehouse space and storage facilities",
    icon: Warehouse,
    href: "/operations/facilities/warehouse",
    status: "ready" as const
  },
  {
    title: "Construction Projects",
    description: "Track and manage facility construction and renovation projects",
    icon: Construction,
    href: "/operations/facilities/construction",
    status: "ready" as const
  }
];

export const FacilitiesGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {facilitiesModules.map((module) => (
        <ModuleCard key={module.title} {...module} />
      ))}
    </div>
  );
};