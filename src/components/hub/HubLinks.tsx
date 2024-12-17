import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResourceLinks } from "./links/ResourceLinks";
import { ModuleLinks } from "./links/ModuleLinks";
import { ToolLinks } from "./links/ToolLinks";
import { AgentLinks } from "./links/AgentLinks";

export const HubLinks = () => {
  return (
    <Card className="card h-[calc(100vh-8rem)] flex flex-col bg-white">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          <Card className="bg-white p-3 shadow-sm">
            <ResourceLinks />
          </Card>
          
          <Card className="bg-white p-3 shadow-sm">
            <ModuleLinks />
          </Card>
          
          <Card className="bg-white p-3 shadow-sm">
            <ToolLinks />
          </Card>
          
          <Card className="bg-white p-3 shadow-sm">
            <AgentLinks />
          </Card>
        </div>
      </ScrollArea>
    </Card>
  );
};