import { 
  Users, 
  Wrench, 
  ShieldCheck, 
  Factory, 
  Package, 
  ChartBar,
  Building2,
  TruckIcon,
  Activity,
  DollarSign,
  FileText
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
    description: "Manage facilities, maintenance, and company assets",
    icon: Building2,
    href: "/operations/facilities",
    status: "ready"
  },
  {
    title: "Supply Chain",
    description: "Manage vendors, inventory, and logistics",
    icon: TruckIcon,
    href: "/operations/supply-chain",
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
    title: "Quality",
    description: "Quality control, inspection, and assurance tools",
    icon: ShieldCheck,
    href: "/operations/quality",
    status: "ready"
  },
  {
    title: "Sales",
    description: "Sales tracking, forecasting, and customer management",
    icon: DollarSign,
    href: "/operations/sales",
    status: "ready"
  },
  {
    title: "Compliance",
    description: "Regulatory compliance and documentation management",
    icon: FileText,
    href: "/operations/compliance",
    status: "ready"
  }
];