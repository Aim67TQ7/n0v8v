import { Search, Maximize2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

interface ChatHistoryProps {
  className?: string;
}

export const ChatHistory = ({ className }: ChatHistoryProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const recentChats = [
    { title: "Project Kickoff Meeting", id: 1, date: "Today" },
    { title: "Client Presentation Prep", id: 2, date: "Today" },
    { title: "Team Sync up", id: 3, date: "Today" },
    { title: "Product Roadmap Review", id: 4, date: "Today" },
    { title: "Q4 Planning", id: 5, date: "This Week" },
    { title: "Design Review", id: 6, date: "This Week" },
    { title: "Sprint Planning", id: 7, date: "This Week" },
    { title: "Architecture Discussion", id: 8, date: "This Week" },
    { title: "Budget Review", id: 9, date: "Recent" },
    { title: "Marketing Strategy", id: 10, date: "Recent" },
    { title: "Sales Pipeline", id: 11, date: "Recent" },
    { title: "Resource Planning", id: 12, date: "Recent" }
  ];

  const groupedChats = recentChats.reduce((acc, chat) => {
    if (!acc[chat.date]) {
      acc[chat.date] = [];
    }
    acc[chat.date].push(chat);
    return acc;
  }, {});

  const ChatHistoryContent = () => (
    <div className="space-y-2">
      <div className="relative flex-1">
        <Input 
          placeholder="Search chat history..." 
          className="text-sm bg-accent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
      </div>
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-2">
          {Object.entries(groupedChats).map(([date, chats]) => (
            <div key={date} className="space-y-1">
              <h3 className="text-sm font-semibold text-primary px-2">{date}</h3>
              <div className="space-y-0.5">
                {(chats as any[]).slice(0, 4).map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className="block text-xs hover:text-primary hover:bg-accent/50 py-0.5 px-2 rounded transition-colors"
                  >
                    {chat.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <Card className={cn("p-3 bg-white", className)}>
      <div className="mb-2 flex items-center justify-between">
        <h2 className="font-semibold text-sm">Chat History</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6 p-0 hover:bg-accent/50">
              <Search className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] bg-white">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Search Chat History</h2>
              <ChatHistoryContent />
            </div>
          </DialogContent>
        </Dialog>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-2">
          {Object.entries(groupedChats).map(([date, chats]) => (
            <div key={date} className="space-y-1">
              <h3 className="text-sm font-semibold text-primary px-2">{date}</h3>
              <div className="space-y-0.5">
                {(chats as any[]).slice(0, 4).map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className="block text-xs hover:text-primary hover:bg-accent/50 py-0.5 px-2 rounded transition-colors"
                  >
                    {chat.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};