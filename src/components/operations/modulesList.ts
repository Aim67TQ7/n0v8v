import { 
  Users, 
  Wrench, 
  ShieldCheck, 
  Factory, 
  Package, 
  ChartBar,
  Shield,
  Building2,
  BookOpen,
  Globe,
  Building,
  FileSpreadsheet,
  GraduationCap,
  MessageSquare,
  User,
  Mail,
  BarChart2,
  Tool
} from "lucide-react";
import type { ModuleCardProps } from "./ModuleCard";

export const modulesList: ModuleCardProps[] = [
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
    title: "Facilities",
    description: "Manage facilities, maintenance, and company maps",
    icon: Building2,
    href: "/operations/facilities",
    status: "ready"
  },
  {
    title: "Maintenance",
    description: "Equipment maintenance and scheduling",
    icon: Tool,
    href: "/operations/maintenance", 
    status: "ready"
  }
];
