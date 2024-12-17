import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useSessionContext } from "@supabase/auth-helpers-react";

const MarketResearch = () => {
  const [topic, setTopic] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [report, setReport] = useState("");
  const { session } = useSessionContext();
  const { toast } = useToast();

  const generateReport = async () => {
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
      const response = await fetch(
        "https://bjxbwygfelodmhrfswzi.supabase.co/functions/v1/generate-market-research",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic,
            userName: session?.user?.email,
            companyName: "Your Company", // You can fetch this from your company context if available
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      const reportText = await response.text();
      setReport(reportText);
      toast({
        title: "Success",
        description: "Market research report generated successfully",
      });
    } catch (error) {
      console.error("Error generating report:", error);
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
        <FileText className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Market Research</h1>
      </div>

      <Card className="p-6 mb-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Generate Market Research Report</h2>
          <p className="text-muted-foreground">
            Enter a topic or market segment to analyze, and our AI will generate a comprehensive
            market research report including market size, trends, competition, and recommendations.
          </p>
          <div className="flex gap-4">
            <Input
              placeholder="Enter research topic (e.g., Electric Vehicles Market)"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="flex-1"
            />
            <Button onClick={generateReport} disabled={isLoading}>
              {isLoading ? "Generating..." : "Generate Report"}
            </Button>
          </div>
        </div>
      </Card>

      {report && (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Research Report</h2>
          <div className="whitespace-pre-wrap">{report}</div>
        </Card>
      )}
    </div>
  );
};

export default MarketResearch;