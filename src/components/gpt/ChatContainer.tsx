import { useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatInput } from "./ChatInput";
import { MessageList } from "./chat/MessageList";
import { useChatMessages } from "./chat/useChatMessages";
import { ChatActions } from "./ChatActions";
import { Save } from "lucide-react";

interface ChatContainerProps {
  messages: any[];
  onMessagesChange: (messages: any[]) => void;
  chatId: string | null;
  onNewChat?: () => void;
}

export const ChatContainer = ({ 
  messages: initialMessages, 
  onMessagesChange, 
  chatId, 
  onNewChat 
}: ChatContainerProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { 
    messages,
    setMessages,
    isLoading,
    handleSubmit,
  } = useChatMessages(chatId);

  useEffect(() => {
    setMessages(initialMessages);
  }, [initialMessages]);

  useEffect(() => {
    onMessagesChange(messages);
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSave = () => {
    console.log("Saving chat...");
  };

  return (
    <div className="flex flex-col h-[600px]">
      <ChatActions onNewChat={onNewChat} />
      <div className="flex-1 overflow-hidden">
        <MessageList messages={messages} messagesEndRef={messagesEndRef} />
      </div>
      <div className="border-t p-4 space-y-2">
        <ChatInput
          input=""
          setInput={() => {}}
          isLoading={isLoading}
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget.querySelector('input')?.value || '';
            handleSubmit(input);
          }}
        />
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            onClick={handleSave}
            className="gap-2"
          >
            <Save className="h-4 w-4" />
            Save Chat
          </Button>
        </div>
      </div>
    </div>
  );
};