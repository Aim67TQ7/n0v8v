import { 
  LayoutDashboard, 
  ChevronDown,
} from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ModuleGrid } from "./ModuleGrid";
import { useState } from "react";

export const ModulesSection = () => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="bg-white rounded-lg border shadow-sm"
    >
      <CollapsibleTrigger asChild>
        <Button
          variant="ghost"
          className="w-full flex items-center justify-between p-4 hover:bg-gray-50"
        >
          <div className="flex items-center gap-2">
            <LayoutDashboard className="h-5 w-5 text-secondary" />
            <h2 className="text-lg font-semibold">Available Modules</h2>
          </div>
          <ChevronDown
            className={`h-4 w-4 transition-transform ${
              isOpen ? "transform rotate-180" : ""
            }`}
          />
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="p-4 pt-0 space-y-4">
        <ModuleGrid />
      </CollapsibleContent>
    </Collapsible>
  );
};