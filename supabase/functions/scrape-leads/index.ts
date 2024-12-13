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
    const actorResponse = await fetch(
      'https://api.apify.com/v2/acts/drobnikj~google-places-scraper/runs?token=' + APIFY_API_KEY,
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
          "maxImages": 0 // We don't need images
        })
      }
    );

    if (!actorResponse.ok) {
      const errorText = await actorResponse.text();
      console.error('Apify actor start error:', {
        status: actorResponse.status,
        statusText: actorResponse.statusText,
        body: errorText
      });
      throw new Error(`Apify API error: ${actorResponse.status} - ${errorText}`);
    }

    const actorRun = await actorResponse.json();
    
    // Wait for and fetch results
    const datasetId = actorRun.data.defaultDatasetId;
    let results = [];
    let attempts = 0;
    const maxAttempts = 30;
    
    while (attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds between checks
      
      const dataResponse = await fetch(
        `https://api.apify.com/v2/datasets/${datasetId}/items?token=${APIFY_API_KEY}`
      );
      
      if (!dataResponse.ok) {
        console.error('Failed to fetch dataset:', dataResponse.statusText);
        continue;
      }
      
      const places = await dataResponse.json();
      if (places.length > 0) {
        results = places.slice(0, resultCount).map(place => ({
          name: place.name,
          address: place.address,
          phone: place.phoneNumber,
          website: place.website,
          rating: place.rating
        }));
        break;
      }
      
      attempts++;
    }

    if (results.length === 0) {
      console.log('No results found after maximum attempts');
    } else {
      console.log(`Found ${results.length} results`);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        data: results
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