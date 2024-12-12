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
    const { provider } = await req.json();
    console.log(`Checking status for ${provider} API...`);

    // Simplified health check - just verify API key exists and basic endpoint availability
    const endpoints = {
      'groq': {
        url: 'https://api.groq.com/v1/health',
        headers: { 'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}` }
      },
      'openai': {
        url: 'https://api.openai.com/v1/models',
        headers: { 'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}` }
      },
      'anthropic': {
        url: 'https://api.anthropic.com/v1/messages',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
          'anthropic-version': '2023-06-01'
        }
      },
      'perplexity': {
        url: 'https://api.perplexity.ai/health',
        headers: { 'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}` }
      }
    };

    if (!endpoints[provider]) {
      throw new Error('Invalid provider');
    }

    const { url, headers } = endpoints[provider];
    
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        }
      });

      console.log(`${provider} API response status:`, response.status);
      
      return new Response(
        JSON.stringify({ status: response.ok ? 'up' : 'down' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error(`Error checking ${provider} API:`, error);
      return new Response(
        JSON.stringify({ status: 'down' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in check-ai-status function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});