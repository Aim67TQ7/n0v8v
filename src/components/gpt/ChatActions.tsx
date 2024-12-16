import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface ChatActionsProps {
  onNewChat: () => void;
}

export const ChatActions = ({ onNewChat }: ChatActionsProps) => {
  return (
    <div className="sticky top-0 z-10 flex justify-between items-center p-4 bg-white border-b">
      <h2 className="text-lg font-semibold">Chat</h2>
      <Button
        onClick={onNewChat}
        variant="default"
        size="sm"
        className="gap-2"
      >
        <Plus className="h-4 w-4" />
        New Chat
      </Button>
    </div>
  );
};