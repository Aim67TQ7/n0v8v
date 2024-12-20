import { MessageSquare, Calendar, Clock, History, Mail, Reply, FileText, Users, HelpCircle, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

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

const templates = [
  { id: "new-email", label: "New Email", icon: Mail },
  { id: "email-reply", label: "Email Reply", icon: Reply },
  { id: "summarize", label: "Summarize Text", icon: FileText },
  { id: "meeting", label: "Meeting Notes", icon: Users },
  { id: "how-to", label: "How To", icon: HelpCircle },
  { id: "brainstorm", label: "Brainstorm", icon: Lightbulb }
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
    <div className={cn("flex flex-col h-full", className)}>
      <div className="flex items-center gap-2 px-4 py-3 border-b">
        <MessageSquare className="h-5 w-5" />
        <h2 className="text-lg font-semibold">Chat History</h2>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-6">
          {/* History Categories */}
          {categories.map(({ id, label, icon: Icon }) => (
            <div key={id} className="space-y-2">
              <div className="flex items-center gap-2">
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
        </div>
      </ScrollArea>

      {/* Templates Section */}
      <div className="border-t p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Chat Templates</h3>
        <div className="grid grid-cols-2 gap-2">
          {templates.map(({ id, label, icon: Icon }) => (
            <Card
              key={id}
              className="p-2 hover:bg-accent cursor-pointer transition-colors"
              onClick={() => onSelect(id)}
            >
              <div className="flex items-center gap-2">
                <Icon className="h-4 w-4 text-gray-500" />
                <span className="text-xs">{label}</span>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};