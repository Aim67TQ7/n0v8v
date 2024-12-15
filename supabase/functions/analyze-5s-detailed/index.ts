import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls, evaluationId } = await req.json();

    const systemPrompt = `You are a 5S workplace organization expert conducting a detailed evaluation. Analyze the provided images and generate a comprehensive report with the following structure:

    For each category (Sort, Set in Order, and Shine):
    1. Score each of the 10 checklist items (0, 0.5, or 1.0)
    2. Identify positive observations
    3. Note areas of concern
    
    Provide specific, actionable recommendations and follow-up actions.
    
    Format your response as a JSON object with the following structure:
    {
      "sort": {
        "checklist": [{"item": "string", "score": number, "description": "string"}],
        "positiveObservations": ["string"],
        "concerns": ["string"]
      },
      "setInOrder": {
        "checklist": [{"item": "string", "score": number, "description": "string"}],
        "positiveObservations": ["string"],
        "concerns": ["string"]
      },
      "shine": {
        "checklist": [{"item": "string", "score": number, "description": "string"}],
        "positiveObservations": ["string"],
        "concerns": ["string"]
      },
      "recommendations": ["string"],
      "followUpActions": ["string"]
    }`;

    const messages = [];
    imageUrls.forEach((base64Data: string, index: number) => {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze image ${index + 1} for 5S compliance, focusing on Sort, Set in Order, and Shine categories.`
          },
          {
            type: "image",
            source: {
              type: "base64",
              media_type: "image/jpeg",
              data: base64Data
            }
          }
        ]
      });
    });

    console.log('Sending request to Anthropic...');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        system: systemPrompt,
        messages,
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      throw new Error(`Anthropic API error: ${response.status}`);
    }

    const result = await response.json();
    const analysis = JSON.parse(result.content[0].text);

    // Save detailed report to database
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { error: dbError } = await supabase
      .from('five_s_detailed_reports')
      .insert({
        evaluation_id: evaluationId,
        sort_checklist: analysis.sort.checklist,
        sort_positive_observations: analysis.sort.positiveObservations,
        sort_concerns: analysis.sort.concerns,
        set_checklist: analysis.setInOrder.checklist,
        set_positive_observations: analysis.setInOrder.positiveObservations,
        set_concerns: analysis.setInOrder.concerns,
        shine_checklist: analysis.shine.checklist,
        shine_positive_observations: analysis.shine.positiveObservations,
        shine_concerns: analysis.shine.concerns,
        follow_up_actions: analysis.followUpActions,
        recommendations: analysis.recommendations
      });

    if (dbError) throw dbError;

    return new Response(
      JSON.stringify(analysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});