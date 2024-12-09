import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Anthropic } from "https://esm.sh/anthropic@0.9.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY') || '',
    });

    const message = await anthropic.messages.create({
      model: "claude-3-sonnet-20240229",
      max_tokens: 1000,
      temperature: 0.5,
      system: "You are an expert in 5S workplace organization methodology. Analyze the provided image and identify key aspects related to Sort, Set in Order, Shine, Standardize, and Sustain principles.",
      messages: [{
        role: "user",
        content: `Analyze these workplace images (${imageUrls.join(', ')}) for 5S compliance. Focus on visible organization, cleanliness, and standardization. Provide specific observations and recommendations.`
      }]
    });

    return new Response(JSON.stringify(message.content), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-5s-images function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});