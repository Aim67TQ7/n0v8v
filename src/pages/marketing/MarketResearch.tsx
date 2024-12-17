import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/hooks/use-auth";

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
      const response = await fetch("/api/generate-market-research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          userName: user?.email,
          companyName: "Your Company", // You can get this from your company context if available
        }),
      });

      if (!response.ok) throw new Error("Failed to generate report");

      const report = await response.text();
      
      // Create a blob and download the report
      const blob = new Blob([report], { type: "text/plain" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `market-research-${topic.toLowerCase().replace(/\s+/g, "-")}.txt`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "Market research report has been generated",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate market research report",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <FileText className="h-8 w-8 text-secondary" />
        <h1 className="text-3xl font-bold">Market Research Generator</h1>
      </div>

      <Card className="p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Instructions</h2>
        <p className="mb-4">
          This tool generates comprehensive market research reports using advanced AI technology.
          Your report will include:
        </p>
        <ul className="list-disc list-inside mb-4 space-y-2">
          <li>Executive Summary</li>
          <li>Market Overview and Size Analysis</li>
          <li>Segmentation and Target Market Analysis</li>
          <li>Competitive Analysis & SWOT Analysis</li>
          <li>Consumer Insights and Trends</li>
          <li>Strategic Recommendations</li>
          <li>Market Forecasts and Projections</li>
        </ul>
        <p className="text-sm text-muted-foreground">
          The report will be personalized with your name and company information.
        </p>
      </Card>

      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-2">
              What topic would you like to research?
            </label>
            <Input
              id="topic"
              placeholder="e.g., Electric Vehicles Market in North America"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full"
            />
          </div>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Generating Report..." : "Generate Market Research Report"}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default MarketResearch;