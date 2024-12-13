import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const ScraperCard = () => {
  const [userInput, setUserInput] = useState({
    location: '',
    searchTerm: '',
    resultCount: 10
  });
  
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

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader className="bg-gray-50">
        <CardTitle className="flex items-center gap-2">
          <Search className="w-5 h-5" />
          Google Maps Scraper
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6 space-y-4">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Location (City, State)
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="e.g., Austin, TX"
              value={userInput.location}
              onChange={(e) => setUserInput({...userInput, location: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Search Term
            </label>
            <input
              type="text"
              className="w-full p-2 border rounded"
              placeholder="e.g., coffee shops"
              value={userInput.searchTerm}
              onChange={(e) => setUserInput({...userInput, searchTerm: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Results
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded"
              min="1"
              max="100"
              value={userInput.resultCount}
              onChange={(e) => setUserInput({...userInput, resultCount: parseInt(e.target.value)})}
            />
          </div>

          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Search className="w-4 h-4" />
            {isLoading ? 'Searching...' : 'Search'}
          </button>
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
      </CardContent>
    </Card>
  );
};

export default ScraperCard;