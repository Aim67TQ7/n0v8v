import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResourceLinks } from "./links/ResourceLinks";
import { ModuleLinks } from "./links/ModuleLinks";
import { ToolLinks } from "./links/ToolLinks";
import { AgentLinks } from "./links/AgentLinks";

export const HubLinks = () => {
  return (
    <Card className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <Card className="bg-white p-2 shadow-sm">
            <ResourceLinks />
          </Card>
          
          <ModuleLinks />
          
          <ToolLinks />
          
          <AgentLinks />
        </div>
      </ScrollArea>
    </Card>
  );
};