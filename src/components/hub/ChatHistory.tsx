import { Search } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ChatHistory = () => {
  const recentChats = [
    { title: "Project Kickoff Meeting", id: 1 },
    { title: "Client Presentation Prep", id: 2 },
    { title: "Team Sync up", id: 3 },
    { title: "Product Roadmap Review", id: 4 },
    { title: "Q4 Planning", id: 5 },
    { title: "Design Review", id: 6 }
  ];

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Chat History</h2>
      <div className="relative mb-4">
        <Input 
          placeholder="Search chat history..." 
          className="pr-8"
        />
        <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
      </div>
      
      <div className="space-y-4">
        <Card className="p-3">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Today</h3>
          <ScrollArea className="h-[100px]">
            <div className="space-y-1">
              {recentChats.slice(0, 2).map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full justify-start text-left"
                >
                  {chat.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
        
        <Card className="p-3">
          <h3 className="text-sm font-medium text-gray-500 mb-2">This Week</h3>
          <ScrollArea className="h-[100px]">
            <div className="space-y-1">
              {recentChats.slice(2, 4).map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full justify-start text-left"
                >
                  {chat.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
        
        <Card className="p-3">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Recent</h3>
          <ScrollArea className="h-[100px]">
            <div className="space-y-1">
              {recentChats.slice(4).map((chat) => (
                <Button
                  key={chat.id}
                  variant="ghost"
                  className="w-full justify-start text-left"
                >
                  {chat.title}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </Card>
      </div>
    </Card>
  );
};