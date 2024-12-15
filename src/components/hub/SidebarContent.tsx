import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { ChatHistory } from "./ChatHistory";

export const SidebarContent = () => {
  return (
    <div className="h-full flex flex-col">
      <ChatHistory className="flex-grow" />
      <Card className="card mt-4">
        <div className="p-4">
          <Textarea
            placeholder="Provide feedback, improve data, or report hallucinations..."
            className="mb-2 text-xs text-secondary-content content-area"
            rows={3}
          />
          <Button 
            variant="link" 
            className="text-sm font-semibold text-primary hover:text-primary/80 px-2"
          >
            Train the Model
          </Button>
        </div>
      </Card>
    </div>
  );
};