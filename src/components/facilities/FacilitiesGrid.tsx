import { ModuleCard } from "@/components/operations/ModuleCard";
import { Database, ClipboardList, Calendar, BookOpen, Package } from "lucide-react";

const facilitiesModules = [
  {
    title: "Asset Tracking",
    description: "Track and manage facility assets, equipment, and resources",
    icon: Database,
    href: "/operations/facilities/assets",
    status: "coming-soon" as const
  },
  {
    title: "Work Orders",
    description: "Create and manage maintenance work orders and requests",
    icon: ClipboardList,
    href: "/operations/facilities/work-orders",
    status: "coming-soon" as const
  },
  {
    title: "Preventive Maintenance",
    description: "Schedule and track routine maintenance activities",
    icon: Calendar,
    href: "/operations/facilities/maintenance",
    status: "coming-soon" as const
  },
  {
    title: "Equipment History",
    description: "Access equipment documentation and maintenance history",
    icon: BookOpen,
    href: "/operations/facilities/equipment",
    status: "coming-soon" as const
  },
  {
    title: "Inventory Control",
    description: "Manage spare parts and maintenance supplies inventory",
    icon: Package,
    href: "/operations/facilities/inventory",
    status: "coming-soon" as const
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