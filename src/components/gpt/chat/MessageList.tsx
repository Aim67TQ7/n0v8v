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
  const formatMessage = (content: string) => {
    return content.split('\n\n').map((paragraph, i) => (
      <p key={i} className="mb-2 last:mb-0">
        {paragraph.trim()}
      </p>
    ));
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
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
                {message.content}
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