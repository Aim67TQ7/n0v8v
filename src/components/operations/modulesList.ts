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
import { ModuleCardProps } from "./ModuleCard";

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

export const customerFocusTools: ModuleCardProps[] = [
  {
    title: "Lead Generation",
    description: "Web scraping tools for automated lead generation",
    icon: Search,
    href: "/leads/scraping",
    status: "ready"
  }
];