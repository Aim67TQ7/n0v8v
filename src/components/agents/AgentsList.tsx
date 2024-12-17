import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot } from "lucide-react";

interface Agent {
  name: string;
  role: string;
  href: string;
  description: string;
}

const agents: Agent[] = [
  {
    name: "Maggie",
    role: "Inside Sales",
    href: "/sales/research",
    description: "Sales research and lead qualification specialist"
  },
  {
    name: "Faraday",
    role: "Technical",
    href: "/operations/engineering/research",
    description: "Engineering and technical documentation expert"
  },
  {
    name: "Magnus",
    role: "Service",
    href: "/operations/service/research",
    description: "Customer service and support specialist"
  },
  {
    name: "Morgan",
    role: "Complaints",
    href: "/operations/complaints/resolution",
    description: "Customer complaint resolution expert"
  },
  {
    name: "Alex",
    role: "Cold Calls",
    href: "/sales/cold-calls",
    description: "Cold calling and outreach specialist"
  },
  {
    name: "Riley",
    role: "Market Research",
    href: "/marketing/research",
    description: "Market analysis and competitive research expert"
  },
  {
    name: "Casey",
    role: "VAVE Analysis",
    href: "/operations/quality/vave",
    description: "Value analysis and value engineering specialist"
  },
  {
    name: "Chip",
    role: "Raw Data Analysis",
    href: "/data/raw-analysis",
    description: "Raw data processing and analysis expert"
  },
  {
    name: "Quincy",
    role: "Data Metrics",
    href: "/data/metrics",
    description: "Business metrics and KPI analysis specialist"
  },
  {
    name: "Dexter",
    role: "Charts & Graphics",
    href: "/data/visualizations",
    description: "Data visualization and reporting expert"
  }
];

export const AgentsList = () => {
  return (
    <Card className="h-[calc(100vh-8rem)] p-4">
      <div className="flex items-center gap-2 mb-4">
        <Bot className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Agents</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-2">
          {agents.map((agent) => (
            <Card 
              key={agent.name}
              className="p-3 hover:bg-accent transition-colors cursor-pointer"
            >
              <h3 className="font-medium">{agent.name}</h3>
              <p className="text-sm text-muted-foreground">{agent.role}</p>
              <p className="text-xs text-muted-foreground mt-1">{agent.description}</p>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};