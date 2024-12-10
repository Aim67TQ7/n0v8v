import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

interface SidebarHeaderProps {
  onNewChat: () => void;
}

export const SidebarHeader = ({ onNewChat }: SidebarHeaderProps) => {
  return (
    <div className="border-b p-4 shrink-0">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <img 
            src="/lovable-uploads/2c6383aa-9d2d-43af-9b0e-bd66dea3a1de.png" 
            alt="Logo" 
            className="h-6 w-auto"
          />
          <h2 className="text-lg font-semibold">GPT</h2>
        </div>
        <SidebarTrigger />
      </div>
      <Button
        variant="outline"
        className="w-full mt-2 gap-2"
        onClick={onNewChat}
      >
        <Plus className="h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};