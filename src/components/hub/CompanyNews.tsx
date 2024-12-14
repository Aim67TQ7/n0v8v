import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CompanyNews = () => {
  const updates = [
    { id: 1, title: "Latest company update 1", content: "Details about update 1..." },
    { id: 2, title: "Latest company update 2", content: "Details about update 2..." },
    { id: 3, title: "Latest company update 3", content: "Details about update 3..." },
  ];

  return (
    <Card className="p-4">
      <h2 className="font-semibold mb-4">Company News Scroll</h2>
      <ScrollArea className="h-[200px]">
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="p-3 bg-accent rounded-lg">
              <h3 className="font-medium text-sm">{update.title}</h3>
              <p className="text-sm text-muted-foreground">{update.content}</p>
            </div>
          ))}
        </div>
      </ScrollArea>
    </Card>
  );
};