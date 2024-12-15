import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ChatHistory } from "./ChatHistory";

export const SidebarContent = () => {
  return (
    <div className="h-full flex flex-col">
      <ChatHistory className="flex-grow" />
      <Card className="p-4 mt-4 bg-white/90 backdrop-blur-sm">
        <Textarea
          placeholder="Provide feedback, improve data, or report hallucinations..."
          className="mb-2 text-xs text-gray-900 bg-white/80 border border-gray-100 focus:border-gray-200 transition-colors"
          rows={3}
        />
        <Button 
          variant="link" 
          className="text-sm font-semibold text-primary hover:text-primary/80 px-2"
        >
          Train the Model
        </Button>
      </Card>
    </div>
  );
};