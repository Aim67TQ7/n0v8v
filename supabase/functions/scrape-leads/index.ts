import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (req) => {
  try {
    // Parse the request body
    const { query, resultCount = 10 } = await req.json();
    
    if (!query) {
      return new Response(
        JSON.stringify({ success: false, error: 'Query parameter is required' }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    // Get the Apify API key from environment variables
    const APIFY_API_KEY = Deno.env.get('APIFY_API_KEY');
    if (!APIFY_API_KEY) {
      console.error('APIFY_API_KEY not found in environment variables');
      throw new Error('Apify API key not configured');
    }

    // Construct the search query for Google Maps
    console.log('Making request to Apify API with query:', query);

    // Create and start the Apify actor run
    const actorResponse = await fetch(
      `https://api.apify.com/v2/actor-tasks/drobnikj~google-places-scraper/runs?token=${APIFY_API_KEY}`,
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
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST',
          'Access-Control-Allow-Headers': 'Content-Type'
        }
      }
    );

  } catch (error) {
    console.error('Error in scrape-leads function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    );
  }
});