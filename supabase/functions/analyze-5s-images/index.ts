import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Anthropic from 'https://esm.sh/@anthropic-ai/sdk@0.17.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    // Get the API key from environment variables
    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) {
      throw new Error('ANTHROPIC_API_KEY is not set in environment variables')
    }

    const anthropic = new Anthropic({
      apiKey: apiKey,
    });

    const { imageUrls } = await req.json()
    console.log('Received image URLs:', imageUrls);

    const systemPrompt = `You are a 5S workplace organization expert. Analyze the provided workplace images and evaluate them based on the 5S principles:

1. Sort (Seiri): Evaluate how well items are organized and unnecessary items are removed
2. Set in Order (Seiton): Assess the arrangement and accessibility of necessary items
3. Shine (Seiso): Check cleanliness and maintenance of the workspace
4. Standardize (Seiketsu): Look for evidence of consistent procedures and visual management
5. Sustain (Shitsuke): Evaluate adherence to standards and continuous improvement practices

For each principle, provide:
1. A numerical score from 1-5
2. Specific observations that justify the score
3. Clear, actionable recommendations for improvement

Also identify:
- Key strengths: What's working well and should be maintained
- Weaknesses: Areas that need immediate attention
- Opportunities: Potential improvements that could enhance efficiency
- Threats: Safety concerns or risks that need addressing

Format your response as a JSON object with the following structure:
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

    const imagePrompt = imageUrls.map((url: string) => `Image URL: ${url}`).join('\n')

    console.log('Sending request to Anthropic...');
    const message = await anthropic.messages.create({
      model: "claude-3-opus-20240229",
      max_tokens: 1024,
      messages: [
        { role: "user", content: [
          { type: "text", text: systemPrompt },
          { type: "text", text: imagePrompt }
        ]}
      ],
    });
    console.log('Received response from Anthropic');

    const analysis = JSON.parse(message.content[0].text);
    console.log('Parsed analysis:', analysis);

    return new Response(
      JSON.stringify(analysis),
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