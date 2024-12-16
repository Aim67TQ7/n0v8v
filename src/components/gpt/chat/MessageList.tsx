import { Card } from "@/components/ui/card";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: {
    name: string;
    url: string;
  };
}

interface MessageListProps {
  messages: Message[];
  messagesEndRef: React.RefObject<HTMLDivElement>;
}

export const MessageList = ({ messages, messagesEndRef }: MessageListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {messages.map((message, index) => (
        <Card
          key={index}
          className={`p-4 border ${
            message.role === 'user' 
              ? 'bg-primary/10 border-primary/20' 
              : 'bg-secondary/10 border-secondary/20'
          }`}
        >
          <div className="flex items-start gap-3">
            <div className="font-medium min-w-[60px] text-xs">
              {message.role === 'user' ? 'You' : 'Assistant'}:
            </div>
            <div className="flex-1 whitespace-pre-wrap text-xs">
              {message.attachment ? (
                <a href={message.attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                  {message.content}
                </a>
              ) : (
                message.content
              )}
            </div>
          </div>
        </Card>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};