import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResourceLinks } from "./links/ResourceLinks";
import { ModuleLinks } from "./links/ModuleLinks";
import { ToolLinks } from "./links/ToolLinks";
import { AgentLinks } from "./links/AgentLinks";
import { Link } from "react-router-dom";
import { HelpCircle } from "lucide-react";

export const HubLinks = () => {
  return (
    <Card className="h-full flex flex-col bg-white">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-3">
          <ResourceLinks />
          <ModuleLinks />
          <ToolLinks />
          <AgentLinks />
          
          <div className="pt-4 mt-4 border-t">
            <Link
              to="/faq"
              className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
            >
              <HelpCircle className="h-4 w-4" />
              FAQ
            </Link>
          </div>
        </div>
      </ScrollArea>
    </Card>
  );
};