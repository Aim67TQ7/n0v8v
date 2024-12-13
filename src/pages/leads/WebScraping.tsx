import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WebScraping = () => {
  const [url, setUrl] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleScrape = async () => {
    setIsLoading(true);
    try {
      toast({
        title: "Feature Coming Soon",
        description: "Web scraping functionality will be available in the next update.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your request.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Globe className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Lead Generation</h1>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-medium mb-2">Web Scraping</h2>
            <p className="text-muted-foreground">
              Enter a website URL to extract potential lead information such as contact details and company information.
            </p>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Enter website URL"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleScrape} 
              disabled={!url || isLoading}
            >
              <Search className="h-4 w-4 mr-2" />
              Scrape
            </Button>
          </div>

          <div className="bg-muted p-4 rounded-md">
            <p className="text-sm text-muted-foreground">
              Note: This tool respects robots.txt files and website terms of service. 
              Please ensure you have permission to scrape the target website.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default WebScraping;