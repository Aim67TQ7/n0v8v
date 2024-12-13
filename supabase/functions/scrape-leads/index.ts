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
      console.error('SERPI_API_KEY not found in environment variables');
      throw new Error('SERPI API key not configured');
    }

    // Construct the search query for Google Maps
    const query = `${searchTerm} in ${location}`;
    const encodedQuery = encodeURIComponent(query);

    console.log('Making request to SERPI API with query:', query);

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
      const errorText = await response.text();
      console.error('SERPI API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`SERPI API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('SERPI API response received:', {
      placesCount: data.places?.length || 0
    });

    // Transform the data into our expected format
    const results = data.places?.map(place => ({
      name: place.title,
      address: place.address,
      phone: place.phoneNumber,
      website: place.website,
      rating: place.rating
    })) || [];

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
    
    // Return a more detailed error response
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
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