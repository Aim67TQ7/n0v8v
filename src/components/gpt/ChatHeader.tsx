import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ChatHeaderProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

export const ChatHeader = ({ isCollapsed, onToggle }: ChatHeaderProps) => {
  return (
    <div className="flex items-center justify-between p-2 border-b">
      <h2 className={`font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>Company GPT</h2>
      <Button 
        variant="ghost" 
        size="sm"
        onClick={onToggle}
        className="h-8 w-8 p-0"
      >
        {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
      </Button>
    </div>
  );
};