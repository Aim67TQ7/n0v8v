import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, User } from "lucide-react";
import { Agent } from "@/types/agents";

interface AgentsListProps {
  onAgentDrop: (agent: Agent) => void;
}

const agents: Agent[] = [
  {
    name: "Riley",
    role: "Conversation Bot",
    href: "/agents/conversation",
    description: "Advanced conversational AI for natural dialogue and assistance",
    category: "service"
  },
  {
    name: "Morgan",
    role: "NLP - Tonality",
    href: "/agents/nlp",
    description: "Sentiment analysis and tone detection specialist",
    category: "service"
  },
  {
    name: "Quincy",
    role: "Scraper",
    href: "/agents/scraper",
    description: "Ethical data collection and web scraping expert",
    category: "data"
  },
  {
    name: "Chip",
    role: "Researcher",
    href: "/agents/researcher",
    description: "Comprehensive research and analysis specialist",
    category: "data"
  },
  {
    name: "Dexter",
    role: "Data Analysis",
    href: "/agents/analysis",
    description: "Advanced data analysis and visualization expert",
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