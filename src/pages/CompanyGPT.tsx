import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatInterface } from "@/components/gpt/ChatInterface";
import { ConversationStarters } from "@/components/gpt/ConversationStarters";
import { ChatHistory } from "@/components/gpt/ChatHistory";
import { Dashboard } from "@/components/Dashboard";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";

const CompanyGPT = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState("groq");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSession, setSelectedSession] = useState<string>();
  const [showNewChat, setShowNewChat] = useState(true);

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

  const gptName = profile?.company?.settings?.[0]?.gpt_name || "CompanyGPT";
  const allowedModels = profile?.allowed_models || ["groq"];

  // Mock chat sessions for demo
  const chatSessions = [
    {
      id: "1",
      title: "Production Efficiency Ideas",
      timestamp: new Date("2024-03-10"),
    },
    {
      id: "2",
      title: "Safety Procedures",
      timestamp: new Date("2024-03-09"),
    },
  ];

  const handleNewChat = () => {
    setSelectedSession(undefined);
    setShowNewChat(true);
    setPrompt("");
  };

  const handleSessionSelect = (sessionId: string) => {
    setSelectedSession(sessionId);
    setShowNewChat(false);
  };

  const handleStarterSelect = (starterPrompt: string) => {
    setPrompt(starterPrompt);
    setShowNewChat(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      toast({
        title: "Message sent",
        description: "Your message has been sent to the AI model.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">{gptName}</h2>
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
          <SidebarContent>
            <ChatHistory
              sessions={chatSessions}
              onSelect={handleSessionSelect}
              selectedId={selectedSession}
            />
          </SidebarContent>
        </Sidebar>

        <div className="flex-1 flex">
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b">
              <ModelSelector
                selectedModel={selectedModel}
                allowedModels={allowedModels}
                onModelChange={setSelectedModel}
              />
            </div>

            <div className="flex-1 overflow-auto p-4">
              {showNewChat ? (
                <ConversationStarters onSelect={handleStarterSelect} />
              ) : (
                <div className="mb-4">
                  {/* Chat messages will go here */}
                </div>
              )}
              
              <div className="sticky bottom-0 bg-background pt-4">
                <ChatInterface
                  prompt={prompt}
                  isLoading={isLoading}
                  onPromptChange={setPrompt}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>

          <div className="w-80 border-l p-4 overflow-auto">
            <Dashboard />
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default CompanyGPT;