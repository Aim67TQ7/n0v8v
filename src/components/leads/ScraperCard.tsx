import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, Download } from 'lucide-react';
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

      if (!data.data || !Array.isArray(data.data)) {
        throw new Error('Invalid response format from scraping service');
      }

      setResults(data.data);
      toast({
        title: "Search Complete",
        description: `Found ${data.data.length} results`,
      });
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: "Search Failed",
        description: error.message || "Failed to fetch results. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!results || results.length === 0) return;

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

          <div className="flex gap-2">
            <button
              onClick={handleSearch}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
              {isLoading ? 'Searching...' : 'Search'}
            </button>

            {results && results.length > 0 && (
              <button
                onClick={downloadCSV}
                className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </button>
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
                  {result.rating && (
                    <p className="text-sm text-gray-600">Rating: {result.rating}</p>
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