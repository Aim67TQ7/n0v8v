import { 
  Building,
  FileText,
  Factory,
  ShieldCheck,
  TruckIcon,
  Settings,
  Activity,
  Building2,
  DollarSign
} from "lucide-react";
import type { ModuleCardProps } from "../ModuleCard";

export const operationsModules: ModuleCardProps[] = [
  {
    title: "Compliance",
    description: "Regulatory compliance and documentation management",
    icon: FileText,
    href: "/operations/compliance",
    status: "ready"
  },
  {
    title: "Facilities",
    description: "Manage facilities, maintenance, and company assets",
    icon: Building2,
    href: "/operations/facilities",
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
    title: "Supply Chain",
    description: "Manage vendors, inventory, and logistics",
    icon: TruckIcon,
    href: "/operations/supply-chain",
    status: "ready"
  }
];