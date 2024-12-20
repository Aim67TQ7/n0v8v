import { MessageSquare, Calendar, Clock, History } from "lucide-react";
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
  { id: "today", label: "Today", icon: Calendar },
  { id: "this-week", label: "This Week", icon: Clock },
  { id: "recent", label: "Recent", icon: History }
];

export const ChatHistory = ({ sessions = [], onSelect, selectedId, className }: ChatHistoryProps) => {
  const groupedSessions = sessions.reduce((acc, session) => {
    let category = "recent";
    const now = new Date();
    const sessionDate = new Date(session.timestamp);
    
    if (sessionDate.toDateString() === now.toDateString()) {
      category = "today";
    } else if (sessionDate > new Date(now.setDate(now.getDate() - 7))) {
      category = "this-week";
    }
    
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(session);
    return acc;
  }, {} as Record<string, ChatSession[]>);

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 px-2 py-3">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Chat History</h2>
      </div>
      
      <ScrollArea className="h-[calc(100vh-12rem)]">
        {categories.map(({ id, label, icon: Icon }) => (
          <div key={id} className="mb-4">
            <div className="flex items-center gap-2 px-2 mb-2">
              <Icon className="h-4 w-4 text-gray-500" />
              <h3 className="text-sm font-medium text-gray-900">{label}</h3>
            </div>
            <div className="space-y-1">
              {(groupedSessions[id] || []).map((session) => (
                <Button
                  key={session.id}
                  variant={selectedId === session.id ? "secondary" : "ghost"}
                  className="justify-start w-full text-left hover:bg-accent transition-colors"
                  onClick={() => onSelect(session.id)}
                >
                  <span className="truncate">{session.title}</span>
                </Button>
              ))}
            </div>
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};