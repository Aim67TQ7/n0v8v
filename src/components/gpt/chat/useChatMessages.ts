import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Message {
  role: 'user' | 'assistant';
  content: string;
  attachment?: {
    name: string;
    url: string;
  };
}

export const useChatMessages = (chatId: string | null) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const updateChatMessages = async () => {
    if (!chatId || messages.length === 0) return;
    
    try {
      const { error } = await supabase
        .from('chat_logs')
        .update({ 
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content,
            attachment: msg.attachment
          }))
        })
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

  useEffect(() => {
    if (chatId && messages.length > 0) {
      updateChatMessages();
    }
  }, [messages, chatId]);

  const handleSubmit = async (input: string) => {
    if (!input.trim() || !chatId || isLoading) return;

    try {
      setIsLoading(true);
      const userMessage: Message = { role: 'user', content: input };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);

      const { data, error } = await supabase.functions.invoke('chat-with-anthropic', {
        body: {
          messages: newMessages,
          chatId: chatId
        },
      });

      if (error) {
        console.error('Edge function error:', error);
        throw new Error(error.message || 'Failed to get AI response');
      }

      if (!data) {
        throw new Error('No response data received');
      }

      setMessages([...newMessages, data.message]);
    } catch (error: any) {
      console.error('Chat error:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to process message",
        variant: "destructive"
      });
      // Optionally remove the user message if the AI response failed
      setMessages(messages);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (file: File) => {
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

      const fileMessage: Message = {
        role: 'user',
        content: `[Attached file: ${file.name}](${publicUrl})`,
        attachment: {
          name: file.name,
          url: publicUrl
        }
      };

      setMessages([...messages, fileMessage]);
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

  return {
    messages,
    setMessages,
    isLoading,
    handleSubmit,
    handleFileUpload
  };
};