import { ChatInterface } from "./ChatInterface";
import { ConversationStarters } from "./ConversationStarters";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  selectedSession?: string;
  chatSessions: any[];
  onHistoryUpdate: () => void;
}

export const ChatContainer = ({ 
  selectedSession, 
  chatSessions,
  onHistoryUpdate 
}: ChatContainerProps) => {
  return (
    <div className="flex-1 flex flex-col">
      {!selectedSession && !chatSessions.length ? (
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <Card className="m-4 flex items-center justify-center">
              <ConversationStarters onSelect={(prompt) => {
                const chatInterface = document.querySelector('textarea');
                if (chatInterface) {
                  (chatInterface as HTMLTextAreaElement).value = prompt;
                }
              }} />
            </Card>
          </ScrollArea>
          <div className="p-4 border-t">
            <ChatInterface 
              systemPrompt={`You are BuntingGPT, an AI assistant specialized in magnetic separation and metal detection solutions.`}
              onHistoryUpdate={onHistoryUpdate}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <ChatInterface 
            systemPrompt={`You are BuntingGPT, an AI assistant specialized in magnetic separation and metal detection solutions.`}
            onHistoryUpdate={onHistoryUpdate}
          />
        </div>
      )}
    </div>
  );
};