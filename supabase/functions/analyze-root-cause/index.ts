import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { currentStep, problemStatement, selectedAssumption, iterationHistory } = await req.json();
    
    console.log('Processing root cause analysis request:', {
      currentStep,
      problemStatement,
      selectedAssumption,
      iterationHistory
    });

    const messages = [
      {
        role: "system",
        content: `You are a root cause analysis expert. Follow this process strictly:
        1. For step 0: Rephrase the problem statement and provide 3 initial assumptions
        2. For steps 1-5: Take the selected assumption and provide 3 deeper "why" assumptions
        3. Always provide exactly 3 assumptions
        4. Keep responses focused and concise
        Format your response as JSON with fields:
        - rephrased (string, only for step 0)
        - whyQuestion (string)
        - assumptions (array of 3 strings)`
      }
    ];

    // Build conversation history
    if (currentStep === 0) {
      messages.push({
        role: "user",
        content: `Initial problem statement: "${problemStatement}"`
      });
    } else {
      messages.push({
        role: "user",
        content: `Current step: ${currentStep}
Previous assumption selected: "${selectedAssumption}"
History: ${JSON.stringify(iterationHistory)}`
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages,
        temperature: 0.7,
        max_tokens: 500,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI response:', data);

    return new Response(
      JSON.stringify({ content: data.choices[0].message.content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-root-cause function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});