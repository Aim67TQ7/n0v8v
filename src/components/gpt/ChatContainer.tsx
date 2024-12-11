import { useState } from "react";
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
  const [inputValue, setInputValue] = useState("");

  const handleStarterSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1">
            <ChatInterface 
              systemPrompt={`You are BuntingGPT, an AI assistant specialized in magnetic separation and metal detection solutions.`}
              onHistoryUpdate={onHistoryUpdate}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </ScrollArea>
        </div>
        
        {/* Conversation Starters - Fixed position at bottom left */}
        <div className="w-64 border-l">
          <div className="sticky bottom-0 p-4 bg-white border-t">
            <ConversationStarters onSelect={handleStarterSelect} />
          </div>
        </div>
      </div>
    </div>
  );
};