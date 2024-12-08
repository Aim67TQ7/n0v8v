import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    const response = await fetch(imageUrl);
    const arrayBuffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    return base64;
  } catch (error) {
    console.error('Error fetching and converting image:', error);
    throw new Error('Failed to fetch and convert image to base64');
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set');
    }

    const { imageUrls } = await req.json();
    console.log('Analyzing images:', imageUrls);

    const analyses = [];
    for (const url of imageUrls) {
      const systemPrompt = `You are a 5S workplace organization expert analyzing a workplace image. Focus ONLY on what you can actually see in the image.

For each 5S principle, provide a score from 0-10 based on visible evidence:

Sort (Seiri):
- Look for unnecessary items, clutter, or obsolete materials
- Check if only essential tools and materials are present
- Identify any obvious waste or excess inventory

Set in Order (Seiton):
- Observe if items have designated storage locations
- Check if tools and materials are arranged logically
- Look for visual management systems (labels, shadows, markings)

Shine (Seiso):
- Assess cleanliness of equipment, floors, and surfaces
- Look for signs of regular cleaning
- Check for any dirt, dust, or debris

Standardize (Seiketsu):
- Look for visual standards or procedures posted
- Check for consistent organization methods
- Observe if 5S practices appear to be maintained

Sustain (Shitsuke):
- Look for evidence of regular audits or checklists
- Check if improvements appear to be maintained
- Observe signs of continuous improvement

Provide your response in valid JSON format with these exact fields:
{
  "sort_score": number (0-10),
  "set_in_order_score": number (0-10),
  "shine_score": number (0-10),
  "standardize_score": number (0-10),
  "sustain_score": number (0-10),
  "strengths": string[] (only include clearly visible positive practices),
  "weaknesses": string[] (include visible hazards with their severity: -5 for critical, -3 for moderate, -1 for minor),
  "opportunities": string[] (specific improvements based on visible issues),
  "threats": string[] (specific action items based on visible conditions)
}`;

      console.log('Converting image to base64:', url);
      const base64Image = await fetchImageAsBase64(url);
      
      console.log('Sending request to Anthropic for image analysis');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          model: 'claude-3-opus-20240229',
          max_tokens: 1024,
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: systemPrompt },
                { 
                  type: 'image', 
                  source: {
                    type: 'base64',
                    media_type: 'image/jpeg',
                    data: base64Image
                  }
                }
              ]
            }
          ]
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Anthropic API error response:', errorData);
        throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
      }

      const data = await response.json();
      console.log('Raw Anthropic response:', data);

      if (!data.content || !data.content[0] || !data.content[0].text) {
        console.error('Unexpected Anthropic response structure:', data);
        throw new Error('Invalid response structure from Anthropic API');
      }

      let analysis;
      try {
        analysis = JSON.parse(data.content[0].text);
        console.log('Successfully parsed analysis for image:', url);
      } catch (error) {
        console.error('Failed to parse Anthropic response:', data.content[0].text);
        throw new Error('Failed to parse AI response as JSON');
      }

      const requiredFields = [
        'sort_score', 'set_in_order_score', 'shine_score', 
        'standardize_score', 'sustain_score', 'strengths', 
        'weaknesses', 'opportunities', 'threats'
      ];

      for (const field of requiredFields) {
        if (!(field in analysis)) {
          throw new Error(`Missing required field in AI response: ${field}`);
        }
      }

      analyses.push(analysis);
    }

    const combinedAnalysis = {
      sort_score: Math.round(analyses.reduce((sum, a) => sum + a.sort_score, 0) / analyses.length * 10) / 10,
      set_in_order_score: Math.round(analyses.reduce((sum, a) => sum + a.set_in_order_score, 0) / analyses.length * 10) / 10,
      shine_score: Math.round(analyses.reduce((sum, a) => sum + a.shine_score, 0) / analyses.length * 10) / 10,
      standardize_score: Math.round(analyses.reduce((sum, a) => sum + a.standardize_score, 0) / analyses.length * 10) / 10,
      sustain_score: Math.round(analyses.reduce((sum, a) => sum + a.sustain_score, 0) / analyses.length * 10) / 10,
      strengths: [...new Set(analyses.flatMap(a => a.strengths))],
      weaknesses: [...new Set(analyses.flatMap(a => a.weaknesses))],
      opportunities: [...new Set(analyses.flatMap(a => a.opportunities))],
      threats: [...new Set(analyses.flatMap(a => a.threats))]
    };

    console.log('Final combined analysis:', combinedAnalysis);

    return new Response(
      JSON.stringify(combinedAnalysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-5s-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});