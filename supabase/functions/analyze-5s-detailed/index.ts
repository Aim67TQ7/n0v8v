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
    console.log('Processing request for evaluation:', evaluationId);
    console.log('Number of images:', imageUrls.length);

    const systemPrompt = `You are a 5S workplace organization expert conducting a detailed evaluation. Analyze the provided images and generate a comprehensive report.

    For each category (Sort, Set in Order, and Shine):
    1. Score each of the 10 checklist items (0, 0.5, or 1.0)
    2. Identify positive observations
    3. Note areas of concern
    
    Provide specific, actionable recommendations and follow-up actions.
    
    Format your response as a JSON object with this exact structure:
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
        temperature: 0.5, // Reduced temperature for more consistent output
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Anthropic API error: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    console.log('Received response from Anthropic');
    
    if (!result.content || !result.content[0] || !result.content[0].text) {
      console.error('Unexpected response structure:', result);
      throw new Error('Invalid response structure from Anthropic API');
    }

    let analysis;
    try {
      // Extract JSON from the response text - look for JSON structure
      const text = result.content[0].text;
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.error('No JSON found in response:', text);
        throw new Error('No JSON structure found in AI response');
      }
      
      analysis = JSON.parse(jsonMatch[0]);
      console.log('Successfully parsed analysis:', analysis);
    } catch (error) {
      console.error('Failed to parse Anthropic response:', error);
      console.error('Raw response text:', result.content[0].text);
      throw new Error('Failed to parse AI response');
    }

    // Validate the analysis structure
    if (!analysis.sort?.checklist || !analysis.setInOrder?.checklist || !analysis.shine?.checklist) {
      console.error('Invalid analysis structure:', analysis);
      throw new Error('AI response missing required fields');
    }

    // Ensure all required arrays exist with defaults
    analysis.sort.positiveObservations = analysis.sort.positiveObservations || [];
    analysis.sort.concerns = analysis.sort.concerns || [];
    analysis.setInOrder.positiveObservations = analysis.setInOrder.positiveObservations || [];
    analysis.setInOrder.concerns = analysis.setInOrder.concerns || [];
    analysis.shine.positiveObservations = analysis.shine.positiveObservations || [];
    analysis.shine.concerns = analysis.shine.concerns || [];
    analysis.recommendations = analysis.recommendations || [];
    analysis.followUpActions = analysis.followUpActions || [];

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

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    console.log('Successfully saved detailed report to database');

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