import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

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
      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers = {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        };
        body = {
          model: 'claude-3-haiku-20240307',
          messages: [{ role: 'user', content: 'test' }],
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
          messages: [{ role: 'user', content: 'test' }],
        };
        break;
      case 'groq':
        endpoint = 'https://api.groq.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
          'Content-Type': 'application/json',
        };
        body = {
          model: 'mixtral-8x7b-32768',
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
          model: 'pplx-7b-online',
          messages: [{ role: 'user', content: 'test' }],
        };
        break;
      default:
        throw new Error('Invalid provider');
    }

    try {
      console.log(`Making request to ${endpoint}`);
      const response = await fetch(endpoint, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
      });

      console.log(`${provider} API response status:`, response.status);
      
      return new Response(
        JSON.stringify({ status: response.ok ? 'up' : 'down' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      console.error(`Error checking ${provider} API:`, error);
      return new Response(
        JSON.stringify({ status: 'down', error: error.message }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Error in check-ai-status function:', error);
    return new Response(
      JSON.stringify({ error: error.message, status: 'down' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});