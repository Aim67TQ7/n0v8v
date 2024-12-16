import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatActionsProps {
  onNewChat: () => void;
}

export const ChatActions = ({ onNewChat }: ChatActionsProps) => {
  return (
    <div className="flex justify-between items-center p-4 border-b">
      <h2 className="text-lg font-semibold">Chat</h2>
      <Button
        variant="ghost"
        size="sm"
        onClick={onNewChat}
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};