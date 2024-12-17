import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import { Agent } from "@/types/agents";

interface AgentsListProps {
  onAgentDrop: (agent: Agent) => void;
}

const agents: Agent[] = [
  {
    name: "Maggie",
    role: "Inside Sales",
    href: "/sales/research",
    description: "Sales research and lead qualification specialist",
    category: "sales"
  },
  {
    name: "Faraday",
    role: "Technical",
    href: "/operations/engineering/research",
    description: "Engineering and technical documentation expert",
    category: "operations"
  },
  {
    name: "Magnus",
    role: "Service",
    href: "/operations/service/research",
    description: "Customer service and support specialist",
    category: "service"
  },
  {
    name: "Morgan",
    role: "Complaints",
    href: "/operations/complaints/resolution",
    description: "Customer complaint resolution expert",
    category: "service"
  },
  {
    name: "Alex",
    role: "Cold Calls",
    href: "/sales/cold-calls",
    description: "Cold calling and outreach specialist",
    category: "sales"
  },
  {
    name: "Riley",
    role: "Market Research",
    href: "/marketing/research",
    description: "Market analysis and competitive research expert",
    category: "sales"
  },
  {
    name: "Casey",
    role: "VAVE Analysis",
    href: "/operations/quality/vave",
    description: "Value analysis and value engineering specialist",
    category: "operations"
  },
  {
    name: "Chip",
    role: "Raw Data Analysis",
    href: "/data/raw-analysis",
    description: "Raw data processing and analysis expert",
    category: "data"
  },
  {
    name: "Quincy",
    role: "Data Metrics",
    href: "/data/metrics",
    description: "Business metrics and KPI analysis specialist",
    category: "data"
  },
  {
    name: "Dexter",
    role: "Charts & Graphics",
    href: "/data/visualizations",
    description: "Data visualization and reporting expert",
    category: "data"
  }
];

export const AgentsList = ({ onAgentDrop }: AgentsListProps) => {
  const handleDragStart = (e: React.DragEvent, agent: Agent) => {
    e.dataTransfer.setData('application/json', JSON.stringify(agent));
  };

  return (
    <Card className="h-[calc(100vh-8rem)]">
      <div className="flex items-center gap-2 p-4 border-b">
        <Bot className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">AI Agents</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <div className="space-y-2 p-4">
          {agents.map((agent) => (
            <Card 
              key={agent.name}
              className="p-3 hover:bg-accent transition-colors cursor-move"
              draggable
              onDragStart={(e) => handleDragStart(e, agent)}
            >
              <div className="flex items-start gap-3">
                <User className="h-8 w-8 text-muted-foreground shrink-0" />
                <div>
                  <h3 className="font-medium flex items-center gap-2">
                    {agent.name}
                    <span className="text-xs text-muted-foreground">
                      {agent.role}
                    </span>
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {agent.description}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};