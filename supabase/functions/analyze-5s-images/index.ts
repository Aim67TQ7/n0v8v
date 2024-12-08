import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
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
    const anthropic = new Anthropic({
      apiKey: Deno.env.get('ANTHROPIC_API_KEY'),
    });

    const { imageUrls } = await req.json()

    const systemPrompt = `You are a 5S workplace organization expert. Analyze the provided workplace images and evaluate them based on the 5S principles:
    1. Sort (Seiri)
    2. Set in Order (Seiton)
    3. Shine (Seiso)
    4. Standardize (Seiketsu)
    5. Sustain (Shitsuke)

    For each principle, provide:
    1. A score from 1-5
    2. Specific observations
    3. Recommendations for improvement

    Also identify:
    - Key strengths
    - Areas needing improvement
    - Opportunities for optimization
    - Potential risks or concerns

    Format your response as a JSON object.`

    const imagePrompt = imageUrls.map((url: string) => `Image URL: ${url}`).join('\n')

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

    return new Response(
      JSON.stringify({ analysis: message.content[0].text }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})