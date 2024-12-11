import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { problemStatement, selectedCauses, iteration, generateFishbone } = await req.json();

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: generateFishbone 
              ? 'You are an expert in root cause analysis. Generate a detailed fishbone diagram structure based on the provided problem statement and selected causes.'
              : 'You are an expert in root cause analysis. Generate 5 potential causes for the given problem, considering the current iteration level and previously selected causes.'
          },
          {
            role: 'user',
            content: generateFishbone
              ? `Create a fishbone diagram structure for the problem: "${problemStatement}" with these selected causes: ${JSON.stringify(selectedCauses)}`
              : `Generate 5 potential causes for the problem: "${problemStatement}" (Iteration ${iteration}/5). Previously selected causes: ${JSON.stringify(selectedCauses)}`
          }
        ],
      }),
    });

    const data = await openAIResponse.json();
    
    return new Response(JSON.stringify({
      result: data.choices[0].message.content,
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});