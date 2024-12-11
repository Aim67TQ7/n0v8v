import { ChatInterface } from "./ChatInterface";
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
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden relative">
      <div className="flex flex-1">
        <div className="flex-1 flex flex-col relative">
          <div className="flex-1 overflow-hidden">
            <ChatInterface 
              systemPrompt={systemPrompt}
              onHistoryUpdate={onHistoryUpdate}
              inputValue={inputValue}
              setInputValue={setInputValue}
            />
          </div>
        </div>
      </div>
    </div>
  );
};