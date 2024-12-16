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
    console.log(`Checking status for ${provider} service...`);

    let endpoint = '';
    let headers: Record<string, string> = {};
    let method = 'GET';
    let body = undefined;

    switch (provider) {
      case 'openai':
        endpoint = 'https://api.openai.com/v1/models';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
          'Content-Type': 'application/json',
        };
        break;

      case 'anthropic':
        endpoint = 'https://api.anthropic.com/v1/messages';
        headers = {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
          'anthropic-version': '2023-06-01',
          'Content-Type': 'application/json',
        };
        method = 'POST';
        body = JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          messages: [{ role: 'user', content: 'test' }],
        });
        break;

      case 'perplexity':
        endpoint = 'https://api.perplexity.ai/chat/completions';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
          'Content-Type': 'application/json',
        };
        method = 'POST';
        body = JSON.stringify({
          model: 'sonar-medium-online',
          messages: [{ role: 'user', content: 'test' }],
        });
        break;

      case 'groq':
        endpoint = 'https://api.groq.com/v1/chat/completions';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
          'Content-Type': 'application/json',
        };
        method = 'POST';
        body = JSON.stringify({
          model: 'mixtral-8x7b-32768',
          messages: [{ role: 'user', content: 'test' }],
        });
        break;

      case 'twilio':
        const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID');
        const authToken = Deno.env.get('TWILIO_AUTH_TOKEN');
        endpoint = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Keys.json`;
        headers = {
          'Authorization': `Basic ${btoa(`${accountSid}:${authToken}`)}`,
        };
        break;

      case 'stripe':
        endpoint = 'https://api.stripe.com/v1/balance';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('STRIPE_API_KEY')}`,
        };
        break;

      case 'apify':
        endpoint = 'https://api.apify.com/v2/user/me';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('APIFY_API_KEY')}`,
        };
        break;

      case 'resend':
        endpoint = 'https://api.resend.com/v1/api-keys';
        headers = {
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        };
        break;

      case 'smtp':
        // For SMTP, we'll just check if credentials exist since we can't easily test SMTP connection
        if (!Deno.env.get('STMP_USER') || !Deno.env.get('STMP_PASS')) {
          throw new Error('SMTP credentials not configured');
        }
        return new Response(
          JSON.stringify({ status: 'up' }),
          { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );

      default:
        throw new Error('Invalid provider');
    }

    const response = await fetch(endpoint, {
      method,
      headers,
      ...(body && { body }),
    });

    if (!response.ok) {
      console.error(`Error response from ${provider}:`, await response.text());
      throw new Error(`API returned status ${response.status}`);
    }

    return new Response(
      JSON.stringify({ status: 'up' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in check-service-status function:', error);
    return new Response(
      JSON.stringify({ status: 'down', error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});