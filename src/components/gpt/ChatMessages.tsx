import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

interface ChatMessagesProps {
  messages: Message[];
}

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ScrollArea className="h-[calc(100vh-200px)] px-4 py-4">
      <div className="flex flex-col space-y-4">
        {messages.slice(1).map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {message.role === "assistant" && (
              <div className="text-xs text-muted-foreground mr-2 mt-2">AI</div>
            )}
            <div
              className={`max-w-[80%] rounded-lg p-3 text-sm ${
                message.role === "user"
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-accent text-accent-foreground"
              }`}
            >
              <p className="whitespace-pre-wrap text-sm">{message.content}</p>
            </div>
            {message.role === "user" && (
              <div className="text-xs text-muted-foreground ml-2 mt-2">You</div>
            )}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};