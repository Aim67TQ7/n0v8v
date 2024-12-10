import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatInterface } from "@/components/gpt/ChatInterface";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ApiStatus } from "@/components/gpt/ApiStatus";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { ConversationStarters } from "@/components/gpt/ConversationStarters";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

const CompanyGPT = () => {
  const { session } = useSessionContext();
  const [selectedModel, setSelectedModel] = useState("groq");
  const [selectedSession, setSelectedSession] = useState<string>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);

  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select(`
          *,
          company:companies(
            id,
            name,
            settings:company_settings(gpt_name)
          )
        `)
        .eq("id", session.user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user?.id,
  });

  const fetchChatHistory = async () => {
    if (!profile?.company_id) return;

    const { data, error } = await supabase
      .from('chat_logs')
      .select('*')
      .eq('company_id', profile.company_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching chat history:', error);
      return;
    }

    const sessions = data.map(log => ({
      id: log.id,
      title: log.messages[1]?.content?.slice(0, 30) + "..." || "New Chat",
      timestamp: new Date(log.created_at)
    }));

    setChatSessions(sessions);
  };

  useEffect(() => {
    fetchChatHistory();
  }, [profile?.company_id]);

  const gptName = "DemoGPT";
  const allowedModels = profile?.allowed_models || ["groq"];

  const handleNewChat = () => {
    setSelectedSession(undefined);
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="w-full border-b bg-white">
        <div className="container mx-auto px-4 py-3">
          <ModelSelector
            selectedModel={selectedModel}
            allowedModels={allowedModels}
            onModelChange={setSelectedModel}
          />
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <SidebarProvider>
          <div className="flex w-full h-full">
            <Sidebar className="border-r w-64 flex flex-col">
              <SidebarHeader className="border-b p-4 shrink-0">
                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <ApiStatus />
                    <h2 className="text-lg font-semibold">{gptName}</h2>
                  </div>
                  <SidebarTrigger />
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-2 gap-2"
                  onClick={handleNewChat}
                >
                  <Plus className="h-4 w-4" />
                  New Chat
                </Button>
              </SidebarHeader>
              <div className="flex-1 overflow-hidden">
                <SidebarContent>
                  <ChatHistory
                    sessions={chatSessions}
                    onSelect={handleSessionSelect}
                    selectedId={selectedSession}
                  />
                </SidebarContent>
              </div>
            </Sidebar>

            <div className="flex-1 flex">
              <div className="flex-1 flex flex-col">
                {!selectedSession && !chatSessions.length ? (
                  <div className="flex-1 flex items-center justify-center">
                    <ConversationStarters onSelect={(prompt) => {
                      const chatInterface = document.querySelector('textarea');
                      if (chatInterface) {
                        (chatInterface as HTMLTextAreaElement).value = prompt;
                      }
                    }} />
                  </div>
                ) : (
                  <ChatInterface 
                    onHistoryUpdate={fetchChatHistory}
                  />
                )}
              </div>
              
              <div className="w-64 border-l p-4 overflow-y-auto hidden lg:block">
                <ResourceSidebar />
              </div>
            </div>
          </div>
        </SidebarProvider>
      </div>
    </div>
  );
};

export default CompanyGPT;