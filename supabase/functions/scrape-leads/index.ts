import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { location, searchTerm, resultCount } = await req.json();
    console.log('Processing scraping request:', { location, searchTerm, resultCount });

    const SERPI_API_KEY = Deno.env.get('SERPI_API_KEY');
    if (!SERPI_API_KEY) {
      throw new Error('SERPI API key not configured');
    }

    // Construct the search query for Google Maps
    const query = `${searchTerm} in ${location}`;
    const encodedQuery = encodeURIComponent(query);

    const response = await fetch(
      `https://google.serper.dev/places?q=${encodedQuery}&limit=${resultCount}`,
      {
        headers: {
          'X-API-KEY': SERPI_API_KEY,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`SERPI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('SERPI API response:', data);

    // Transform the data into our expected format
    const results = data.places.map(place => ({
      name: place.title,
      address: place.address,
      phone: place.phoneNumber,
      website: place.website,
      rating: place.rating
    }));

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results.slice(0, resultCount) 
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