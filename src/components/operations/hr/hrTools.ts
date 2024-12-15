import { User, BookOpen, Shield, DollarSign, Users } from "lucide-react";
import type { ModuleCardProps } from "@/components/operations/ModuleCard";

export const hrTools: ModuleCardProps[] = [
  {
    title: "Employee Data",
    description: "View and manage employee information",
    icon: User,
    href: "/operations/hr/employee-data",
    status: "ready"
  },
  {
    title: "Employee Handbook",
    description: "Access company policies and procedures",
    icon: BookOpen,
    href: "/operations/hr/handbook",
    status: "ready"
  },
  {
    title: "Insurance Benefits",
    description: "Learn about available insurance coverage and benefits",
    icon: Shield,
    href: "/operations/hr/insurance",
    status: "ready"
  },
  {
    title: "Tax Assistance",
    description: "Access tax-related resources and forms",
    icon: DollarSign,
    href: "/operations/hr/tax",
    status: "ready"
  },
  {
    title: "Organization Chart",
    description: "View company structure and reporting relationships",
    icon: Users,
    href: "/operations/hr/org-chart",
    status: "ready"
  }
];