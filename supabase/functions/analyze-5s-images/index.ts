import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

async function fetchImageAsBase64(imageUrl: string): Promise<string> {
  try {
    console.log('Fetching image from URL:', imageUrl);
    const response = await fetch(imageUrl);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.status} ${response.statusText}`);
    }
    
    const arrayBuffer = await response.arrayBuffer();
    const uint8Array = new Uint8Array(arrayBuffer);
    
    const chunkSize = 0x8000;
    let binary = '';
    
    for (let i = 0; i < uint8Array.length; i += chunkSize) {
      const chunk = uint8Array.slice(i, i + chunkSize);
      binary += String.fromCharCode.apply(null, chunk);
    }
    
    const base64 = btoa(binary);
    console.log('Successfully converted image to base64');
    return base64;
  } catch (error) {
    console.error('Error fetching and converting image:', error);
    throw new Error(`Failed to fetch and convert image: ${error.message}`);
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    console.log('Analyzing images:', imageUrls);

    const systemPrompt = `You are a 5S workplace organization expert analyzing workplace images. Evaluate all provided images as a single workcenter, focusing on what you can actually see. Consolidate common issues across all images into single, comprehensive findings.

For each 5S principle, provide a score from 0-10 based on visible evidence across all images:

Sort (Seiri):
- Look for unnecessary items or excess materials
- Check if only essential tools and materials are present
- Identify opportunities for better organization

Set in Order (Seiton):
- Observe if items have designated storage locations
- Check if tools and materials are arranged logically
- Look for visual management systems (labels, shadows, markings)

Shine (Seiso):
- Assess cleanliness of equipment, floors, and surfaces
- Look for signs of regular cleaning
- Check for any maintenance needs

Standardize (Seiketsu):
- Look for visual standards or procedures posted
- Check for consistent organization methods
- Observe if 5S practices appear to be maintained

Sustain (Shitsuke):
- Look for evidence of regular audits or checklists
- Check if improvements appear to be maintained
- Observe signs of continuous improvement

For strengths, provide specific positive practices observed across all images:
Example: "Well-organized tool shadow board visible in work area. Current setup enables quick tool access and accountability. Maintain this system and consider implementing in other areas."

For areas of improvement, consolidate common issues across all images and format each finding as:
1. The specific issue observed across the workcenter
2. The impact on operations
3. A clear, actionable solution with expected benefits

Example improvement finding:
"Scattered tools on workbench visible in multiple areas. Current state causes time waste searching for tools. Create shadow boards with designated spots for each tool and label clearly to improve efficiency and reduce search time."

Provide your response in valid JSON format with these exact fields:
{
  "sort_score": number (0-10),
  "set_in_order_score": number (0-10),
  "shine_score": number (0-10),
  "standardize_score": number (0-10),
  "sustain_score": number (0-10),
  "strengths": string[] (only include clearly visible positive practices),
  "weaknesses": string[] (include specific issues, impacts, and solutions)
}`;

    const analyses = [];
    for (const url of imageUrls) {
      console.log('Converting image to base64:', url);
      const base64Image = await fetchImageAsBase64(url);
      
      console.log('Sending request to Anthropic for image analysis');
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
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
        const responseText = data.content[0].text;
        const jsonMatch = responseText.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('No JSON object found in response');
        }
        analysis = JSON.parse(jsonMatch[0]);
        console.log('Successfully parsed analysis for image:', url);
      } catch (error) {
        console.error('Failed to parse Anthropic response:', data.content[0].text);
        throw new Error(`Failed to parse AI response as JSON: ${error.message}`);
      }

      const requiredFields = [
        'sort_score', 'set_in_order_score', 'shine_score', 
        'standardize_score', 'sustain_score', 'strengths', 
        'weaknesses'
      ];

      for (const field of requiredFields) {
        if (!(field in analysis)) {
          throw new Error(`Missing required field in AI response: ${field}`);
        }
      }

      analyses.push(analysis);
    }

    // Consolidate analyses across all images
    const combinedAnalysis = {
      sort_score: Math.round(analyses.reduce((sum, a) => sum + a.sort_score, 0) / analyses.length * 10) / 10,
      set_in_order_score: Math.round(analyses.reduce((sum, a) => sum + a.set_in_order_score, 0) / analyses.length * 10) / 10,
      shine_score: Math.round(analyses.reduce((sum, a) => sum + a.shine_score, 0) / analyses.length * 10) / 10,
      standardize_score: Math.round(analyses.reduce((sum, a) => sum + a.standardize_score, 0) / analyses.length * 10) / 10,
      sustain_score: Math.round(analyses.reduce((sum, a) => sum + a.sustain_score, 0) / analyses.length * 10) / 10,
      strengths: [...new Set(analyses.flatMap(a => a.strengths))],
      weaknesses: [...new Set(analyses.flatMap(a => a.weaknesses))]
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
