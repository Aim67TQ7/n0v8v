import { ChatHistory } from "@/components/hub/ChatHistory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const SidebarContent = () => {
  return (
    <div className="h-full flex flex-col">
      <ChatHistory className="flex-grow" />
      <Card className="p-4 mt-4">
        <Textarea
          placeholder="Provide feedback, improve data, or report hallucinations..."
          className="mb-2 text-xs border border-gray-100 focus:border-gray-200 transition-colors"
          rows={3}
        />
        <Button 
          variant="link" 
          className="w-full text-primary hover:text-primary/80"
        >
          Train the Model
        </Button>
      </Card>
    </div>
  );
};