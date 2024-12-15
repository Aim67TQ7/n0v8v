import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CompanyNews = () => {
  const updates = [
    "Latest company update 1: Details about update 1...",
    "Latest company update 2: Details about update 2...",
    "Latest company update 3: Details about update 3...",
  ];

  return (
    <Card className="p-1 bg-white">
      <ScrollArea className="h-[100px]">
        <div className="space-y-1">
          {updates.map((update, index) => (
            <p key={index} className="text-xs text-gray-900 px-2">
              {update}
            </p>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};