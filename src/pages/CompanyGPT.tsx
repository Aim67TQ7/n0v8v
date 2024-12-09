import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { ModelSelector } from "@/components/gpt/ModelSelector";
import { ChatInterface } from "@/components/gpt/ChatInterface";
import { ResourceSidebar } from "@/components/gpt/ResourceSidebar";

const CompanyGPT = () => {
  const { session } = useSessionContext();
  const { toast } = useToast();
  const [selectedModel, setSelectedModel] = useState("groq");
  const [prompt, setPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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

  useEffect(() => {
    setPrompt(`Hello ${gptName}! I'm ready to brainstorm ideas. Please help me outline improvements to our customer onboarding process.`);
  }, [gptName]);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-8">
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">{gptName}</h1>
          
          <ModelSelector
            selectedModel={selectedModel}
            allowedModels={allowedModels}
            onModelChange={setSelectedModel}
          />

          <ChatInterface
            prompt={prompt}
            isLoading={isLoading}
            onPromptChange={setPrompt}
            onSubmit={handleSubmit}
          />
        </div>

        <ResourceSidebar />
      </div>
    </div>
  );
};

export default CompanyGPT;