import { useState, useEffect, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { ChatActions } from "./ChatActions";
import { ChatInput } from "./ChatInput";

interface ChatContainerProps {
  messages: any[];
  onMessagesChange: (messages: any[]) => void;
  chatId: string | null;
  onNewChat?: () => void;
}

export const ChatContainer = ({ 
  messages, 
  onMessagesChange, 
  chatId, 
  onNewChat 
}: ChatContainerProps) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatId && messages.length > 0) {
      updateChatMessages();
    }
  }, [messages, chatId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateChatMessages = async () => {
    try {
      const { error } = await supabase
        .from('chat_logs')
        .update({ messages })
        .eq('id', chatId);

      if (error) throw error;
    } catch (error) {
      console.error('Error saving messages:', error);
      toast({
        title: "Error",
        description: "Failed to save chat messages",
        variant: "destructive"
      });
    }
  };

  const handleNewChat = () => {
    if (onNewChat) {
      onNewChat();
    }
    setInput("");
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const filePath = `chat-attachments/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('Knowledge')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('Knowledge')
        .getPublicUrl(filePath);

      const fileMessage = {
        role: 'user',
        content: `[Attached file: ${file.name}](${publicUrl})`,
        attachment: {
          name: file.name,
          url: publicUrl
        }
      };

      onMessagesChange([...messages, fileMessage]);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !chatId) return;

    try {
      setIsLoading(true);
      const userMessage = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      onMessagesChange(newMessages);
      setInput("");

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          chatId: chatId
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      onMessagesChange([...newMessages, data.message]);
    } catch (error) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: "Failed to process message",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ChatActions onNewChat={handleNewChat} />
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`p-4 ${
              message.role === 'user' ? 'bg-primary/10' : 'bg-secondary/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="font-medium min-w-[60px]">
                {message.role === 'user' ? 'You' : 'Assistant'}:
              </div>
              <div className="flex-1 whitespace-pre-wrap">
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

      <ChatInput
        input={input}
        setInput={setInput}
        isLoading={isLoading}
        onSubmit={handleSubmit}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};