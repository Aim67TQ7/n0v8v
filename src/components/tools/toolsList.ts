import { 
  Bot, 
  FileText,
  MessageSquare,
  Search,
  Brain,
  Mail,
  Phone,
  Database,
  Image,
  Wrench,
  GitFork,
  Fish,
  Newspaper
} from "lucide-react";
import { LucideIcon } from "lucide-react";

interface Tool {
  title: string;
  description: string;
  icon: LucideIcon;
  href: string;
  status: "ready" | "coming-soon";
  functionName?: string;
}

export const tools: Tool[] = [
  {
    title: "Chat Analysis",
    description: "AI-powered chat analysis with multiple model options",
    icon: MessageSquare,
    href: "/company-gpt",
    status: "ready",
    functionName: "chat-with-ai"
  },
  {
    title: "Groq Integration",
    description: "High-performance AI model integration",
    icon: Brain,
    href: "/tools/groq",
    status: "ready",
    functionName: "chat-with-groq"
  },
  {
    title: "AI Status Check",
    description: "Monitor AI services and model availability",
    icon: Bot,
    href: "/tools/ai-status",
    status: "ready",
    functionName: "check-ai-status"
  },
  {
    title: "Document Processing",
    description: "Process and analyze documents with RAG technology",
    icon: FileText,
    href: "/tools/process-document",
    status: "ready",
    functionName: "process-rag-document"
  },
  {
    title: "Lead Generation",
    description: "Automated lead scraping and analysis",
    icon: Search,
    href: "/leads/scraping",
    status: "ready",
    functionName: "scrape-leads"
  },
  {
    title: "Email Automation",
    description: "Automated email sending and processing",
    icon: Mail,
    href: "/tools/email",
    status: "ready",
    functionName: "send-email"
  },
  {
    title: "SMS Integration",
    description: "SMS messaging and notifications",
    icon: Phone,
    href: "/tools/sms",
    status: "ready",
    functionName: "send-sms"
  },
  {
    title: "Maintenance Analysis",
    description: "AI-powered equipment maintenance analysis",
    icon: Wrench,
    href: "/operations/maintenance",
    status: "ready",
    functionName: "analyze-maintenance"
  },
  {
    title: "5S Analysis",
    description: "Detailed 5S workplace organization analysis",
    icon: Database,
    href: "/operations/lean/5s-vision",
    status: "ready",
    functionName: "analyze-5s-detailed"
  },
  {
    title: "Process Analysis",
    description: "Visual process analysis and improvement",
    icon: Image,
    href: "/operations/process",
    status: "ready",
    functionName: "analyze-process"
  },
  {
    title: "Five Whys Analysis",
    description: "Root cause analysis using Five Whys methodology",
    icon: GitFork,
    href: "/operations/quality/five-whys",
    status: "ready",
    functionName: "analyze-five-whys"
  },
  {
    title: "Fishbone Analysis",
    description: "Cause and effect analysis using Fishbone diagram",
    icon: Fish,
    href: "/operations/quality/fishbone",
    status: "ready",
    functionName: "analyze-fishbone"
  },
  {
    title: "Company News",
    description: "Manage and publish company announcements",
    icon: Newspaper,
    href: "/operations/hr/company-news",
    status: "ready",
    functionName: "manage-news"
  }
];