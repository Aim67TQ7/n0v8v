import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { imageUrls } = await req.json()

    const messages = [
      {
        role: "system",
        content: `You are a 5S evaluation expert. For each image, analyze the workspace and provide specific feedback for each S category (Sort, Set in Order, Shine, Standardize, Sustain). Score each category from 1-10. Reference specific details from the images in your analysis. Format your response as JSON with the following structure:
        {
          "sort_score": number,
          "set_in_order_score": number,
          "shine_score": number,
          "standardize_score": number,
          "sustain_score": number,
          "strengths": string[],
          "weaknesses": string[],
          "opportunities": string[],
          "analysis": {
            "sort": { "observations": string[], "score": number },
            "set_in_order": { "observations": string[], "score": number },
            "shine": { "observations": string[], "score": number },
            "standardize": { "observations": string[], "score": number },
            "sustain": { "observations": string[], "score": number }
          }
        }`
      }
    ]

    // Add each image to the messages array
    imageUrls.forEach((url: string, index: number) => {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze image ${index + 1} for 5S compliance`
          },
          {
            type: "image_url",
            image_url: { url }
          }
        ]
      })
    })

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`)
    }

    const result = await response.json()
    const analysis = JSON.parse(result.choices[0].message.content)

    return new Response(JSON.stringify(analysis), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})