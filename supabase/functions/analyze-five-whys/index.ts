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
              ? 'You are an expert in root cause analysis. Generate a detailed analysis including a fishbone diagram, root cause identification, and recommended actions.'
              : `You are an expert in root cause analysis. For iteration ${iteration}/5, generate 5 potential deeper causes based on the previously selected causes. Each cause should be more specific than the last iteration.`
          },
          {
            role: 'user',
            content: generateFishbone
              ? `Analyze this problem: "${problemStatement}" with these selected causes: ${JSON.stringify(selectedCauses)}. 
                 Provide: 1) A text-based fishbone diagram, 2) The identified root cause, 3) Recommended corrective actions, 
                 4) Preventive actions to avoid similar issues in the future.`
              : `Problem: "${problemStatement}"
                 Previous selections: ${JSON.stringify(selectedCauses)}
                 Generate 5 more specific potential causes for iteration ${iteration}.`
          }
        ],
      }),
    });

    const data = await openAIResponse.json();
    const result = data.choices[0].message.content;

    if (generateFishbone) {
      // Parse the structured response into sections
      const sections = result.split('\n\n');
      const analysis = {
        fishboneDiagram: sections[0],
        rootCause: sections[1].replace('Root Cause: ', ''),
        correctiveActions: sections[2].replace('Corrective Actions:\n', '').split('\n'),
        preventiveActions: sections[3].replace('Preventive Actions:\n', '').split('\n')
      };
      return new Response(JSON.stringify({ result: analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For regular iterations, return the list of causes
    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});