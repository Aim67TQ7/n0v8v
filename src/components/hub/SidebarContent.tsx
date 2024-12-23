import { ChatHistory } from "./ChatHistory";
import { AgentsList } from "@/components/agents/AgentsList";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bot, Grid, Wrench } from "lucide-react";
import { ModuleLinks } from "./links/ModuleLinks";
import { ToolLinks } from "./links/ToolLinks";

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
        <AccordionItem value="roles" className="border-none">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Grid className="h-5 w-5" />
              <span className="text-sm font-medium">Department Roles</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4">
              <ModuleLinks />
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="tools" className="border-none">
          <AccordionTrigger className="px-4 py-2 hover:no-underline">
            <div className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              <span className="text-sm font-medium">Efficiency Tools</span>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="px-4">
              <ToolLinks />
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};