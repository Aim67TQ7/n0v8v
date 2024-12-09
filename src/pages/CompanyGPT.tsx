import { useEffect, useState } from "react";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ExternalLink, MessageSquare, FileText, Building } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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
    // Set initial prompt
    setPrompt(`Hello ${gptName}! I'm ready to brainstorm ideas. Please help me outline improvements to our customer onboarding process.`);
  }, [gptName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // TODO: Implement actual API call to selected model
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
        {/* Main Chat Interface */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold mb-6">{gptName}</h1>
          
          {/* Model Selection */}
          <div className="mb-6">
            <RadioGroup
              value={selectedModel}
              onValueChange={setSelectedModel}
              className="flex gap-4"
            >
              {allowedModels.map((model) => (
                <div key={model} className="flex items-center space-x-2">
                  <RadioGroupItem value={model} id={model} />
                  <Label htmlFor={model} className="capitalize">{model}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Chat Interface */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Type your message here..."
              className="min-h-[200px]"
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </div>

        {/* Resource Cards */}
        <div className="w-64 space-y-4">
          <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <Building className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Open Epicor</h3>
                <p className="text-sm text-muted-foreground">Access ERP system</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </div>
          </Card>

          <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Webpages</h3>
                <p className="text-sm text-muted-foreground">Internal resources</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </div>
          </Card>

          <Card className="p-4 hover:bg-accent cursor-pointer transition-colors">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              <div>
                <h3 className="font-medium">Shared Folder</h3>
                <p className="text-sm text-muted-foreground">Access documents</p>
              </div>
              <ExternalLink className="h-4 w-4 ml-auto" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CompanyGPT;