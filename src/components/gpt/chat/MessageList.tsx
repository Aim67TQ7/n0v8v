import { Card } from "@/components/ui/card";
import { ReactNode } from "react";

interface Message {
  role: 'user' | 'assistant';
  content: string | { type: string; text: string }[];
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
  const formatMessage = (content: string | { type: string; text: string }[]): ReactNode => {
    // If content is a string, handle it as before
    if (typeof content === 'string') {
      return content.split('\n\n').map((paragraph, i) => (
        <p key={i} className="mb-2 last:mb-0">
          {paragraph.trim()}
        </p>
      ));
    }
    
    // If content is an array (new Anthropic format), handle each text block
    if (Array.isArray(content)) {
      return content.map((item, i) => {
        if (item.type === 'text') {
          return item.text.split('\n\n').map((paragraph, j) => (
            <p key={`${i}-${j}`} className="mb-2 last:mb-0">
              {paragraph.trim()}
            </p>
          ));
        }
        return null;
      });
    }

    return <p>Unable to display message</p>;
  };

  return (
    <div className="flex-1 p-4 space-y-4">
      {messages.map((message, index) => (
        <Card
          key={index}
          className={`p-3 ${
            message.role === 'user' 
              ? 'bg-primary/10 border-primary/20 ml-auto max-w-[80%]' 
              : 'bg-secondary/10 border-secondary/20 mr-auto max-w-[80%]'
          }`}
        >
          <div className="text-sm">
            {message.attachment ? (
              <a href={message.attachment.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                {formatMessage(message.content)}
              </a>
            ) : (
              formatMessage(message.content)
            )}
          </div>
        </Card>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};