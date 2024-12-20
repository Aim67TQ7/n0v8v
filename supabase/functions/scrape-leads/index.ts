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

    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      console.error('APIFY_API_KEY not found in environment variables');
      throw new Error('Apify API key not configured');
    }

    // Construct the search query for Google Maps
    const query = `${searchTerm} in ${location}`;
    console.log('Making request to Apify API with query:', query);

    // Create and start the Apify actor run
    // Using the correct actor ID for Google Places Scraper
    const actorResponse = await fetch(
      'https://api.apify.com/v2/actor-tasks/~drobnikj+google-places-scraper/run-sync-get-dataset-items?token=' + APIFY_API_KEY,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "startUrls": [{
            "url": `https://www.google.com/maps/search/${encodeURIComponent(query)}`
          }],
          "maxCrawledPlaces": resultCount,
          "language": "en",
          "maxImages": 0,
          "maxReviews": 0
        })
      }
    );

    if (!actorResponse.ok) {
      const errorText = await actorResponse.text();
      console.error('Apify actor error:', {
        status: actorResponse.status,
        statusText: actorResponse.statusText,
        body: errorText
      });
      throw new Error(`Apify API error: ${actorResponse.status} - ${errorText}`);
    }

    const results = await actorResponse.json();
    console.log(`Found ${results.length} results`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results.slice(0, resultCount).map(place => ({
          name: place.name,
          address: place.address,
          phone: place.phoneNumber,
          website: place.website,
          rating: place.rating
        }))
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