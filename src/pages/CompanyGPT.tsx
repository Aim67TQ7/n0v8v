import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarProvider, Sidebar, SidebarContent } from "@/components/ui/sidebar";
import { ChatContainer } from "@/components/gpt/ChatContainer";
import { SidebarHeader } from "@/components/gpt/SidebarHeader";
import { ConversationStarters } from "@/components/gpt/ConversationStarters";
import { SidebarExpandButton } from "@/components/gpt/SidebarExpandButton";
import { useToast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import { Shield, User } from "lucide-react";

interface ChatSession {
  id: string;
  title: string;
  timestamp: Date;
}

const CompanyGPT = () => {
  const { session } = useSessionContext();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState("groq");
  const [systemPrompt, setSystemPrompt] = useState("");
  const [selectedSession, setSelectedSession] = useState<string>();
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [inputValue, setInputValue] = useState("");

  const { data: profile, error: profileError } = useQuery({
    queryKey: ["user-profile", session?.user?.id],
    queryFn: async () => {
      if (!session?.user?.id) return null;
      
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("*, company:companies(*)")
          .eq("id", session.user.id)
          .maybeSingle();
        
        if (error) {
          console.error("Profile fetch error:", error);
          toast({
            title: "Error",
            description: "Failed to fetch user profile",
            variant: "destructive",
          });
          return null;
        }
        
        return data;
      } catch (error) {
        console.error("Profile fetch error:", error);
        return null;
      }
    },
    enabled: !!session?.user?.id,
    retry: 1,
  });

  useEffect(() => {
    if (!session) {
      navigate("/login");
    }
  }, [session, navigate]);

  const handleModelChange = (modelId: string, newSystemPrompt: string) => {
    setSelectedModel(modelId);
    setSystemPrompt(newSystemPrompt);
  };

  const handleNewChat = () => {
    setSelectedSession(undefined);
  };

  const handleStarterSelect = (prompt: string) => {
    setInputValue(prompt);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'superadmin':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'developer':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  return (
    <div className="h-[calc(100vh-64px)] flex">
      <SidebarProvider>
        <div className="flex w-full relative">
          <Sidebar className="border-r w-64 flex flex-col">
            <SidebarHeader onNewChat={handleNewChat} />
            <ScrollArea className="flex-1">
              <SidebarContent>
                <ChatHistory
                  sessions={chatSessions}
                  onSelect={setSelectedSession}
                  selectedId={selectedSession}
                />
              </SidebarContent>
            </ScrollArea>
            <div className="border-t p-4">
              <ConversationStarters onSelect={handleStarterSelect} />
            </div>
          </Sidebar>

          <SidebarExpandButton />

          <div className="flex-1 relative">
            <ChatContainer 
              selectedSession={selectedSession}
              chatSessions={chatSessions}
              onHistoryUpdate={() => {}}
              inputValue={inputValue}
              setInputValue={setInputValue}
              systemPrompt={systemPrompt}
            />
          </div>
          
          <div className="w-64 border-l bg-white flex flex-col shrink-0">
            <div className="p-4 border-b">
              <div className="flex flex-col gap-2">
                {profile && (
                  <>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-gray-600" />
                      <span className="text-sm font-medium">
                        {profile.first_name} {profile.last_name}
                      </span>
                    </div>
                    <Badge className={`${getRoleBadgeColor(profile.role)} w-fit`}>
                      {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    </Badge>
                  </>
                )}
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ResourceSidebar />
            </div>
            <Card className="m-4 p-4">
              <ModelSelector
                selectedModel={selectedModel}
                onModelChange={handleModelChange}
              />
            </Card>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );
};

export default CompanyGPT;
