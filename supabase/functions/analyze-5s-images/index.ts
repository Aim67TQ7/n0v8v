import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.17.1'
import { compress } from "https://deno.land/x/compress@v0.4.5/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const { imageUrls } = await req.json()
    console.log('Received image URLs:', imageUrls);

    // Analyze each image separately and collect results
    const analyses = [];
    for (const url of imageUrls) {
      const systemPrompt = `You are a 5S workplace organization expert. Analyze the provided workplace image and evaluate it based on the 5S principles. Provide your response in valid JSON format with numerical scores from 1-5 for each principle and lists of observations.

Your response must be a JSON object with exactly these fields and types:
{
  "sort_score": number,
  "set_in_order_score": number,
  "shine_score": number,
  "standardize_score": number,
  "sustain_score": number,
  "strengths": string[],
  "weaknesses": string[],
  "opportunities": string[],
  "threats": string[]
}`;

      console.log('Sending request to Anthropic for image:', url);
      const message = await anthropic.messages.create({
        model: "claude-3-opus-20240229",
        max_tokens: 1024,
        messages: [
          { role: "user", content: [
            { type: "text", text: systemPrompt },
            { type: "text", text: `Image URL: ${url}` }
          ]}
        ],
      });
      
      let analysis;
      try {
        analysis = JSON.parse(message.content[0].text);
        console.log('Successfully parsed analysis for image:', url);
      } catch (error) {
        console.error('Failed to parse Anthropic response:', message.content[0].text);
        throw new Error('Failed to parse AI response as JSON. Response must be valid JSON.');
      }

      // Validate required fields
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

    // Calculate average scores and combine observations
    const combinedAnalysis = {
      sort_score: analyses.reduce((sum, a) => sum + a.sort_score, 0) / analyses.length,
      set_in_order_score: analyses.reduce((sum, a) => sum + a.set_in_order_score, 0) / analyses.length,
      shine_score: analyses.reduce((sum, a) => sum + a.shine_score, 0) / analyses.length,
      standardize_score: analyses.reduce((sum, a) => sum + a.standardize_score, 0) / analyses.length,
      sustain_score: analyses.reduce((sum, a) => sum + a.sustain_score, 0) / analyses.length,
      strengths: [...new Set(analyses.flatMap(a => a.strengths))],
      weaknesses: [...new Set(analyses.flatMap(a => a.weaknesses))],
      opportunities: [...new Set(analyses.flatMap(a => a.opportunities))],
      threats: [...new Set(analyses.flatMap(a => a.threats))]
    };

    console.log('Final combined analysis:', combinedAnalysis);

    return new Response(
      JSON.stringify(combinedAnalysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in analyze-5s-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})