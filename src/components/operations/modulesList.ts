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
  BarChart2
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
    title: "Human Resources",
    description: "Training, competency tracking, and HR resources",
    icon: BookOpen,
    href: "/operations/hr",
    status: "ready"
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
    title: "Bot Conversations",
    description: "AI-powered chat interactions with customers",
    icon: MessageSquare,
    href: "/customer-focus/bot-conversations",
    status: "coming-soon"
  },
  {
    title: "Customer Interaction",
    description: "Track and improve customer engagement",
    icon: User,
    href: "/customer-focus/interactions",
    status: "coming-soon"
  },
  {
    title: "Training Resources",
    description: "Customer service training materials",
    icon: BookOpen,
    href: "/customer-focus/training",
    status: "coming-soon"
  },
  {
    title: "Generate Newsletter",
    description: "AI-powered newsletter content generation",
    icon: Mail,
    href: "/customer-focus/newsletter",
    status: "coming-soon"
  },
  {
    title: "Viral Posts",
    description: "A/B testing for social media content",
    icon: BarChart2,
    href: "/customer-focus/viral-posts",
    status: "coming-soon"
  },
  {
    title: "Lead Generation",
    description: "Web scraping tools for automated lead generation",
    icon: Globe,
    href: "/leads/scraping",
    status: "ready"
  }
];

export const hrTools: ModuleCardProps[] = [
  {
    title: "Training Matrix",
    description: "Track employee training and certifications",
    icon: FileSpreadsheet,
    href: "/operations/hr/training-matrix",
    status: "ready"
  },
  {
    title: "Cross-Training & Competency",
    description: "AI-driven training and skill validation system",
    icon: GraduationCap,
    href: "/operations/hr/training",
    status: "ready"
  }
];
