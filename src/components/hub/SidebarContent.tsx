import { ChatHistory } from "@/components/hub/ChatHistory";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export const SidebarContent = () => {
  return (
    <div className="h-full flex flex-col">
      <ChatHistory className="flex-grow" />
      <Card className="p-4 mt-4">
        <h2 className="font-semibold mb-2">Train the Model</h2>
        <Textarea
          placeholder="Provide feedback, improve data, or report hallucinations..."
          className="mb-2 text-xs border border-gray-100 focus:border-gray-200 transition-colors"
          rows={3}
        />
        <Button className="w-full">Submit Feedback</Button>
      </Card>
    </div>
  );
};