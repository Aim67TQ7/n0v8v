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
    const { provider } = await req.json();
    let endpoint = '';
    let headers = {};
    let body = {};

    console.log(`Checking status for ${provider} API...`);

    switch (provider) {
      case 'groq':
        endpoint = 'https://api.groq.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'system', content: 'test' }],
        };
        break;
      case 'openai':
        endpoint = 'https://api.openai.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'gpt-4',
          messages: [{ role: 'system', content: 'test' }],
        };
        break;
      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers = {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        };
        body = {
          model: 'claude-3-sonnet-20240229',
          messages: [{ role: 'user', content: 'test' }],
        };
        break;
      case 'perplexity':
        endpoint = 'https://api.perplexity.ai/chat/completions';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'sonar-medium-online',
          messages: [{ role: 'system', content: 'test' }],
        };
        break;
      default:
        throw new Error('Invalid provider');
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      console.log(`${provider} API response status:`, response.status);
      
      if (!response.ok) {
        console.error(`Error response from ${provider}:`, await response.text());
        throw new Error(`API returned status ${response.status}`);
      }

      return new Response(
        JSON.stringify({ status: 'up' }),
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