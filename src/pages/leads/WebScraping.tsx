import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Globe, Search, Download } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

const WebScraping = () => {
  const [userInput, setUserInput] = useState({
    location: '',
    searchTerm: '',
    resultCount: 10
  });
  
  const [apiConfig, setApiConfig] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSearch = async () => {
    if (!userInput.location || !userInput.searchTerm) {
      toast({
        title: "Missing Information",
        description: "Please provide both location and search term",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-leads', {
        body: userInput
      });

      if (error) throw error;

      setResults(data.data);
      toast({
        title: "Search Complete",
        description: `Found ${data.data.length} results`,
      });
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Search Failed",
        description: "Failed to fetch results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!results || results.length === 0) return;

    // Convert results to CSV format
    const headers = ['Name', 'Address', 'Phone', 'Website', 'Rating'];
    const csvContent = [
      headers.join(','),
      ...results.map(result => [
        `"${result.name || ''}"`,
        `"${result.address || ''}"`,
        `"${result.phone || ''}"`,
        `"${result.website || ''}"`,
        `"${result.rating || ''}"`,
      ].join(','))
    ].join('\n');

    // Create and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `leads_${userInput.searchTerm}_${userInput.location}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

            <div className="flex gap-2">
              <Button 
                onClick={handleSearch}
                className="flex-1"
                disabled={isLoading}
              >
                <Search className="w-4 h-4 mr-2" />
                {isLoading ? 'Searching...' : 'Search'}
              </Button>

              {results && results.length > 0 && (
                <Button
                  onClick={downloadCSV}
                  variant="outline"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CSV
                </Button>
              )}
            </div>
          </div>

          {results && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Results</h3>
              <div className="space-y-2">
                {results.map((result, index) => (
                  <div key={index} className="border p-4 rounded">
                    <h4 className="font-medium">{result.name}</h4>
                    <p className="text-sm text-gray-600">{result.address}</p>
                    {result.phone && (
                      <p className="text-sm text-gray-600">{result.phone}</p>
                    )}
                    {result.website && (
                      <a 
                        href={result.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:underline"
                      >
                        {result.website}
                      </a>
                    )}
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