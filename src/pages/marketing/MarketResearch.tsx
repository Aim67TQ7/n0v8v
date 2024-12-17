import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";

const MarketResearch = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic) {
      toast({
        title: "Error",
        description: "Please enter a research topic",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data: profile } = await supabase
        .from("profiles")
        .select("first_name, last_name, company_id")
        .eq("id", user?.id)
        .single();

      const { data: company } = await supabase
        .from("companies")
        .select("name")
        .eq("id", profile?.company_id)
        .single();

      const response = await fetch("/api/generate-market-research", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          userName: `${profile?.first_name} ${profile?.last_name}`,
          companyName: company?.name,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `market-research-${topic.toLowerCase().replace(/\s+/g, "-")}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Your market research report has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <Card className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Market Research Generator</h1>
        
        <div className="prose max-w-none mb-6">
          <h2 className="text-xl font-semibold mb-4">Instructions</h2>
          <p>
            This tool generates a comprehensive market research report based on your chosen topic.
            The report includes:
          </p>
          <ul className="list-disc pl-6 mb-4">
            <li>Executive Summary</li>
            <li>Market Overview</li>
            <li>Segmentation and Target Market Analysis</li>
            <li>Competitive Analysis & SWOT Analysis</li>
            <li>Consumer Insights and Trends</li>
            <li>Strategic Recommendations</li>
            <li>Market Forecasts</li>
          </ul>
          <p className="text-sm text-muted-foreground mb-6">
            The report will be customized with your name and company details.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              What topic would you like to research?
            </label>
            <Textarea
              id="topic"
              placeholder="e.g., Electric Vehicle Market in North America"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="min-h-[100px]"
            />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Generating Report..." : "Generate Market Research Report"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MarketResearch;