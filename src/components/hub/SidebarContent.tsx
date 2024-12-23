import { ChatHistory } from "./ChatHistory";
import { AgentsList } from "@/components/agents/AgentsList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bot } from "lucide-react";

export const SidebarContent = () => {
  const handleSelect = (sessionId: string) => {
    console.log('Selected session:', sessionId);
  };

  const handleAgentDrop = (agent: any) => {
    console.log('Agent dropped:', agent);
  };

  return (
    <div className="flex flex-col h-full">
      <Accordion type="multiple" className="flex-grow">
        <AccordionItem value="chat" className="border-none">
          <ChatHistory 
            className="flex-grow" 
            onSelect={handleSelect}
            sessions={[]}
          />
        </AccordionItem>
        <AccordionItem value="agents" className="border-none">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <span className="text-sm font-medium">AI Agents</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4">
              <AgentsList onAgentDrop={handleAgentDrop} />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};