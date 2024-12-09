import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  sessions: ChatSession[];
  onSelect: (sessionId: string) => void;
  selectedId?: string;
}

export const ChatHistory = ({ sessions, onSelect, selectedId }: ChatHistoryProps) => {
  return (
    <div className="flex flex-col gap-1 p-2">
      {sessions.map((session) => (
        <Button
          key={session.id}
          variant={selectedId === session.id ? "secondary" : "ghost"}
          className="justify-start gap-2 h-auto py-2"
          onClick={() => onSelect(session.id)}
        >
          <MessageSquare className="h-4 w-4" />
          <div className="flex flex-col items-start text-sm">
            <span className="font-medium">{session.title}</span>
            <span className="text-xs text-muted-foreground">
              {new Date(session.timestamp).toLocaleDateString()}
            </span>
          </div>
        </Button>
      ))}
    </div>
  );
};