import { MessageSquare, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
  isShared?: boolean;
  category?: string;
}

interface ChatHistoryProps {
  sessions?: ChatSession[];
  onSelect: (sessionId: string) => void;
  selectedId?: string;
  className?: string;
}

const categories = [
  "Today",
  "This Week",
  "Recent",
  "Shared",
  "New Email",
  "Email Reply",
  "Summarize Text",
  "Meeting Notes",
  "How To",
  "Brainstorm"
];

export const ChatHistory = ({ sessions = [], onSelect, selectedId, className }: ChatHistoryProps) => {
  const groupedSessions = sessions.reduce((acc, session) => {
    let category = "Recent";
    const now = new Date();
    const sessionDate = new Date(session.timestamp);
    
    if (session.isShared) {
      category = "Shared";
    } else if (session.category) {
      category = session.category;
    } else if (sessionDate.toDateString() === now.toDateString()) {
      category = "Today";
    } else if (sessionDate > new Date(now.setDate(now.getDate() - 7))) {
      category = "This Week";
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  return (
    <div className={cn("space-y-2", className)}>
      <ScrollArea className="h-[calc(100vh-12rem)]">
        <Link 
          to="/data/rag-upload"
          className="flex items-center gap-2 px-2 py-3 text-sm font-medium text-primary hover:text-primary/80 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Add Training Data
        </Link>
        {categories.map((category) => (
          <div key={category} className="mb-4">
            <h3 className="text-sm font-semibold text-primary px-2 mb-2">{category}</h3>
            <div className="space-y-0.5">
              {(groupedSessions[category] || []).map((session) => (
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
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};