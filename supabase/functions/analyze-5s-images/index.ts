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
        content: "You are a 5S workplace organization expert. Analyze each image for 5S compliance and provide SPECIFIC, DETAILED feedback based on what you observe in the images. For each image: 1) Look for specific items, tools, equipment, and workspace organization 2) Note exact locations and conditions 3) Identify specific safety concerns 4) Make detailed, actionable recommendations"
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

    // Add final message to request specific JSON structure
    messages.push({
      role: "user",
      content: `Provide your analysis in the following JSON structure only, with no additional text or markdown:
{
  "sort_score": <number 1-10>,
  "set_in_order_score": <number 1-10>,
  "shine_score": <number 1-10>,
  "standardize_score": <number 1-10>,
  "sustain_score": <number 1-10>,
  "strengths": [<string array>],
  "weaknesses": [<string array>],
  "analysis": {
    "sort": {
      "observations": [<string array>],
      "score": <number>,
      "specific_improvements": [<string array>]
    },
    "set_in_order": {
      "observations": [<string array>],
      "score": <number>,
      "specific_improvements": [<string array>]
    },
    "shine": {
      "observations": [<string array>],
      "score": <number>,
      "specific_improvements": [<string array>]
    },
    "standardize": {
      "observations": [<string array>],
      "score": <number>,
      "specific_improvements": [<string array>]
    },
    "sustain": {
      "observations": [<string array>],
      "score": <number>,
      "specific_improvements": [<string array>]
    }
  }
}`
    })

    console.log('Sending request to OpenAI...')
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
        max_tokens: 2000,
        response_format: { type: "json_object" }  // Force JSON response
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status} - ${await response.text()}`)
    }

    console.log('Received response from OpenAI')
    const result = await response.json()
    
    try {
      const analysis = JSON.parse(result.choices[0].message.content)
      
      // Add safety deduction if any safety concerns are found
      const safetyKeywords = ['hazard', 'unsafe', 'safety', 'risk', 'danger', 'trip', 'fall', 'spill']
      const allObservations = [
        ...analysis.analysis.sort.observations,
        ...analysis.analysis.set_in_order.observations,
        ...analysis.analysis.shine.observations,
        ...analysis.analysis.standardize.observations,
        ...analysis.analysis.sustain.observations
      ].join(' ').toLowerCase()

      const safetyIssuesFound = safetyKeywords.some(keyword => allObservations.includes(keyword))
      if (safetyIssuesFound) {
        analysis.safety_deduction = 2
        analysis.weaknesses.unshift("Safety concerns identified - immediate attention required")
      }

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    } catch (parseError) {
      console.error('Error parsing OpenAI response:', result.choices[0].message.content)
      throw new Error('Failed to parse OpenAI response as JSON')
    }
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})