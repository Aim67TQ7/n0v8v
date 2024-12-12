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
        content: `You are a 5S workplace organization expert. Analyze each image for 5S compliance and provide SPECIFIC, DETAILED feedback based on what you observe in the images.

For each image:
1. Look for specific items, tools, equipment, and workspace organization
2. Note exact locations and conditions
3. Identify specific safety concerns
4. Make detailed, actionable recommendations

Format your response as JSON with the following structure:
{
  "sort_score": number (1-10),
  "set_in_order_score": number (1-10),
  "shine_score": number (1-10),
  "standardize_score": number (1-10),
  "sustain_score": number (1-10),
  "strengths": string[],
  "weaknesses": string[],
  "analysis": {
    "sort": {
      "observations": string[],
      "score": number,
      "specific_improvements": string[]
    },
    "set_in_order": {
      "observations": string[],
      "score": number,
      "specific_improvements": string[]
    },
    "shine": {
      "observations": string[],
      "score": number,
      "specific_improvements": string[]
    },
    "standardize": {
      "observations": string[],
      "score": number,
      "specific_improvements": string[]
    },
    "sustain": {
      "observations": string[],
      "score": number,
      "specific_improvements": string[]
    }
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
            text: `Analyze image ${index + 1} in detail for 5S compliance. Look for specific items, tools, equipment, and workspace organization. Note exact locations and conditions.`
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
        max_tokens: 2000
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`)
    }

    const result = await response.json()
    const analysis = JSON.parse(result.choices[0].message.content)

    // Add safety deduction if any safety concerns are found
    const safetyKeywords = ['hazard', 'unsafe', 'safety', 'risk', 'danger', 'trip', 'fall', 'spill'];
    const allObservations = [
      ...analysis.analysis.sort.observations,
      ...analysis.analysis.set_in_order.observations,
      ...analysis.analysis.shine.observations,
      ...analysis.analysis.standardize.observations,
      ...analysis.analysis.sustain.observations
    ].join(' ').toLowerCase();

    const safetyIssuesFound = safetyKeywords.some(keyword => allObservations.includes(keyword));
    if (safetyIssuesFound) {
      analysis.safety_deduction = 2;
      analysis.weaknesses.unshift("Safety concerns identified - immediate attention required");
    }

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