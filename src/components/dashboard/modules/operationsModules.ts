import { 
  Building,
  FileText,
  Factory,
  WrenchIcon,
  ShieldCheck,
  TruckIcon,
  Settings,
  Activity,
  Building2
} from "lucide-react";
import type { ModuleCardProps } from "../ModuleCard";

export const operationsModules: ModuleCardProps[] = [
  {
    title: "Compliance",
    description: "Regulatory compliance and documentation",
    icon: FileText,
    href: "/operations/compliance",
    status: "ready"
  },
  {
    title: "Customer Focus",
    description: "CRM and customer service tools",
    icon: Building,
    href: "/operations/customer-focus",
    status: "ready"
  },
  {
    title: "Engineering",
    description: "Technical documentation and processes",
    icon: Settings,
    href: "/operations/engineering",
    status: "ready"
  },
  {
    title: "Facilities",
    description: "Manage facilities and maintenance",
    icon: Building2,
    href: "/operations/facilities",
    status: "ready"
  },
  {
    title: "Lean Manufacturing",
    description: "5S, Kaizen, and continuous improvement tools",
    icon: Activity,
    href: "/operations/lean",
    status: "ready"
  },
  {
    title: "Maintenance",
    description: "Equipment maintenance and scheduling",
    icon: WrenchIcon,
    href: "/operations/maintenance",
    status: "ready"
  },
  {
    title: "Production",
    description: "Manage production planning and execution",
    icon: Factory,
    href: "/operations/production",
    status: "ready"
  },
  {
    title: "Quality",
    description: "Quality control and assurance tools",
    icon: ShieldCheck,
    href: "/operations/quality",
    status: "ready"
  },
  {
    title: "Supply Chain",
    description: "Manage vendors, inventory, and logistics",
    icon: TruckIcon,
    href: "/operations/supply-chain",
    status: "ready"
  }
];