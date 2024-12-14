import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link } from "react-router-dom";

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
      
      <ScrollArea className="h-[400px]">
        <div className="space-y-2 pr-2">
          {Object.entries(groupedChats).map(([date, chats]) => (
            <div key={date} className="space-y-1">
              <h3 className="text-xs font-medium text-gray-500 px-2">{date}</h3>
              <div className="space-y-0.5">
                {(chats as any[]).slice(0, 4).map((chat) => (
                  <Link
                    key={chat.id}
                    to={`/chat/${chat.id}`}
                    className="block px-2 py-0.5 text-xs hover:bg-accent rounded-sm transition-colors"
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