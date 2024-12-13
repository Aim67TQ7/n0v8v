import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Globe, Search } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const WebScraping = () => {
  const [userInput, setUserInput] = useState({
    location: '',
    searchTerm: '',
    resultCount: 10
  });
  
  const [apiConfig, setApiConfig] = useState(null);
  const [results, setResults] = useState(null);
  const { toast } = useToast();

  const generateApiConfig = () => {
    const config = {
      endpoint: 'https://api.example.com/scrape/googlemaps',
      parameters: {
        query: `${userInput.searchTerm} in ${userInput.location}`,
        limit: userInput.resultCount,
        fields: [
          'name',
          'address',
          'rating',
          'reviews',
          'phone',
          'website',
          'hours'
        ],
        format: 'json'
      },
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_API_KEY'
      }
    };
    setApiConfig(config);
    toast({
      title: "Feature Coming Soon",
      description: "The scraping functionality will be available in the next update.",
    });
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
            <h2 className="text-lg font-medium mb-2">Google Maps Scraper</h2>
            <p className="text-muted-foreground">
              Search for businesses by location and category to generate leads.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block">
                Location (City, State)
              </label>
              <Input
                placeholder="e.g., Austin, TX"
                value={userInput.location}
                onChange={(e) => setUserInput({...userInput, location: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Search Term
              </label>
              <Input
                placeholder="e.g., coffee shops"
                value={userInput.searchTerm}
                onChange={(e) => setUserInput({...userInput, searchTerm: e.target.value})}
              />
            </div>
            
            <div>
              <label className="text-sm font-medium mb-1 block">
                Number of Results
              </label>
              <Input
                type="number"
                min="1"
                max="100"
                value={userInput.resultCount}
                onChange={(e) => setUserInput({...userInput, resultCount: parseInt(e.target.value)})}
              />
            </div>

            <Button 
              onClick={generateApiConfig}
              className="w-full"
            >
              <Search className="w-4 h-4 mr-2" />
              Generate Search
            </Button>
          </div>

          {apiConfig && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Generated API Configuration</h3>
              <pre className="bg-muted p-4 rounded overflow-auto">
                {JSON.stringify(apiConfig, null, 2)}
              </pre>
            </div>
          )}

          {results && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Results</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="border p-4 rounded">
                    <h4 className="font-medium">{result.name}</h4>
                    <p className="text-sm text-muted-foreground">{result.address}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default WebScraping;