import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatInterface } from "@/components/gpt/ChatInterface";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
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
  const [selectedModel, setSelectedModel] = useState("gpt-4o");
  const [selectedSession, setSelectedSession] = useState<string>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [companyName, setCompanyName] = useState<string>("Loading...");

  // First, fetch the profile to get the company_id
  const { data: profile, isLoading: isProfileLoading } = useQuery({
    queryKey: ["profile-basic"],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("company_id")
        .eq("id", session.user.id)
        .single();
      
      if (error) {
        console.error("Profile fetch error:", error);
        throw error;
      }
      return data;
    },
    enabled: !!session?.user?.id,
  });

  // Then, fetch the company name separately
  const { data: company } = useQuery({
    queryKey: ["company-name", profile?.company_id],
    queryFn: async () => {
      if (!profile?.company_id) return null;
      const { data, error } = await supabase
        .from("companies")
        .select("name")
        .eq("id", profile.company_id)
        .single();
      
      if (error) {
        console.error("Company fetch error:", error);
        throw error;
      }
      return data;
    },
    enabled: !!profile?.company_id,
  });

  // Update company name when data is available
  useEffect(() => {
    if (company?.name) {
      setCompanyName(company.name);
    }
  }, [company]);

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

  const gptName = `${companyName}GPT`;

  const allowedModels = ["gpt-4o", "gpt-4o-mini"];

  const handleNewChat = () => {
    setSelectedSession(undefined);
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-[#F2FCE2] to-[#F1F0FB]">
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Sidebar>
            <SidebarHeader className="border-b p-4 bg-background/95">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <h2 className="text-lg font-semibold">
                    {isProfileLoading ? "Loading..." : gptName}
                  </h2>
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
            <SidebarContent className="bg-background/95">
              <ChatHistory
                sessions={chatSessions}
                onSelect={handleSessionSelect}
                selectedId={selectedSession}
              />
            </SidebarContent>
          </Sidebar>

          <div className="flex-1 flex">
            <div className="flex-1 flex flex-col bg-background/95">
              <div className="p-4 border-b">
                <ModelSelector
                  selectedModel={selectedModel}
                  allowedModels={allowedModels}
                  onModelChange={setSelectedModel}
                />
              </div>

              <div className="flex-1 overflow-hidden">
                <ChatInterface 
                  onHistoryUpdate={fetchChatHistory}
                />
              </div>
            </div>
            
            <div className="border-l p-4 hidden lg:block bg-background/95">
              <ResourceSidebar />
            </div>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CompanyGPT;