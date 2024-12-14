import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ChatHistory = () => {
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

  return (
    <Card className="p-3">
      <h2 className="font-semibold text-sm mb-2">Chat History</h2>
      <div className="relative mb-2">
        <Input 
          placeholder="Search chat history..." 
          className="pr-8 text-xs"
        />
        <Search className="absolute right-2 top-2.5 h-3 w-3 text-gray-400" />
      </div>
      
      <div className="space-y-2">
        {Object.entries(groupedChats).map(([date, chats]) => (
          <Card key={date} className="p-2">
            <h3 className="text-xs font-medium text-gray-500 mb-1">{date}</h3>
            <ScrollArea className="h-[100px]">
              <div className="space-y-0">
                {(chats as any[]).slice(0, 4).map((chat) => (
                  <Button
                    key={chat.id}
                    variant="ghost"
                    className="w-full justify-start text-left h-6 text-xs py-0"
                  >
                    {chat.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </Card>
        ))}
      </div>
    </Card>
  );
};