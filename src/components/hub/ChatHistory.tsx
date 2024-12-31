import { MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

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

export const ChatHistory = ({ sessions = [], onSelect, selectedId, className }: ChatHistoryProps) => {
  return (
    <div className={cn("flex flex-col h-full", className)}>
      <ScrollArea className="flex-1">
        <div className="p-4">
          <Accordion type="single" collapsible className="space-y-2">
            <AccordionItem value="history" className="border rounded-lg">
              <AccordionTrigger className="px-4 py-2 hover:no-underline">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-gray-500" />
                  <span className="text-xs font-medium">Chat History</span>
                </div>
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-1">
                  {sessions.map((session) => (
                    <Button
                      key={session.id}
                      variant={selectedId === session.id ? "secondary" : "ghost"}
                      className="justify-start w-full text-left hover:bg-accent transition-colors text-xs"
                      onClick={() => onSelect(session.id)}
                    >
                      <span className="truncate">{session.title}</span>
                    </Button>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </ScrollArea>
    </div>
  );
};