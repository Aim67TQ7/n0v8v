import { useState } from "react";
import { ChatInterface } from "./ChatInterface";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ChatContainerProps {
  selectedSession?: string;
  chatSessions: any[];
  onHistoryUpdate: () => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  systemPrompt?: string;
}

export const ChatContainer = ({ 
  selectedSession, 
  chatSessions,
  onHistoryUpdate,
  inputValue,
  setInputValue,
  systemPrompt
}: ChatContainerProps) => {
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col">
          <ScrollArea className="flex-1 pb-[120px]">
            <ChatInterface 
              systemPrompt={systemPrompt}
              onHistoryUpdate={onHistoryUpdate}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};