import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { problemStatement, currentIteration, previousAnswers } = await req.json();

    const messages = [
      {
        role: "system",
        content: "You are an AI assistant helping with root cause analysis. Generate 3 possible causes or follow-up questions based on the context. Keep responses concise and focused."
      },
      {
        role: "user",
        content: `Problem: ${problemStatement}\nIteration: ${currentIteration}\nPrevious answers: ${previousAnswers.join(", ")}\n\nProvide 3 possible causes or follow-up questions.`
      }
    ];

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Analysis response:', data);

    // Parse the response to extract 3 options
    const content = data.content[0].text;
    const options = content
      .split(/\d\./)
      .filter(Boolean)
      .map(option => option.trim())
      .slice(0, 3);

    return new Response(
      JSON.stringify({ options }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-iterative function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});