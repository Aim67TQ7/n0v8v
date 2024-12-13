import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, searchTerm, resultCount } = await req.json();

    console.log('Processing scraping request:', { location, searchTerm, resultCount });

    // For now, return mock data
    const mockResults = Array.from({ length: resultCount }, (_, i) => ({
      name: `Business ${i + 1}`,
      address: `${Math.floor(Math.random() * 1000)} ${location} Street`,
      rating: (Math.random() * 5).toFixed(1),
      phone: `(555) ${String(Math.floor(Math.random() * 900) + 100)}-${String(Math.floor(Math.random() * 9000) + 1000)}`,
      website: `https://example${i + 1}.com`
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: mockResults 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in scrape-leads function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );
  }
});