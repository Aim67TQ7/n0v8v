import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

interface ChatHistoryProps {
  sessions?: ChatSession[];
  onSelect: (sessionId: string) => void;
  selectedId?: string;
}

export const ChatHistory = ({ sessions = [], onSelect, selectedId }: ChatHistoryProps) => {
  return (
    <div className="flex flex-col gap-2">
      {sessions.length === 0 ? (
        <div className="text-base font-medium text-black text-center py-4">
          No chat history yet
        </div>
      ) : (
        sessions.map((session) => (
          <Button
            key={session.id}
            variant={selectedId === session.id ? "secondary" : "ghost"}
            className="justify-start gap-2 h-auto py-3 px-4 w-full text-left hover:bg-accent transition-colors"
            onClick={() => onSelect(session.id)}
          >
            <MessageSquare className="h-4 w-4 shrink-0" />
            <div className="flex flex-col items-start gap-1 overflow-hidden">
              <span className="text-base font-medium text-black truncate w-full">
                {session.title}
              </span>
              <span className="text-sm text-gray-700">
                {new Date(session.timestamp).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })}
              </span>
            </div>
          </Button>
        ))
      )}
    </div>
  );
};