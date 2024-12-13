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
        content: `You are a 5S workplace organization auditor and expert. Your task is to analyze images for 5S compliance and generate a detailed, structured audit report. Focus on the categories of Sort, Set in Order, and Shine. For each image analyzed, provide the following:

**1. Summary of Observations**:
   - Note specific positive observations in the workspace. Highlight areas that align with 5S principles and how they contribute to operational efficiency or safety.
   - Identify specific findings (e.g., misplaced items, disorganization, cleanliness issues). Include detailed descriptions of items, their locations, and their conditions.

**2. Operational Impacts**:
   - Explain how the positive practices are benefiting the organization (e.g., reduced retrieval time, improved safety, enhanced productivity).
   - Describe the negative operational impacts of the findings (e.g., time wasted locating items, increased risk of accidents, reduced efficiency).

**3. Recommendations for Improvement**:
   - Provide actionable, detailed steps to address each finding in the categories of Sort, Set in Order, and Shine.
   - Suggest tools, techniques, or processes to implement these improvements. For example, labeling systems, dedicated storage areas, or cleaning schedules.

**4. Grading for Each Category**:
   - Provide a score out of 10 for each category (Sort, Set in Order, and Shine) based on compliance with 5S principles.
   - Offer a brief justification for each score, citing specific examples from the observations.

Ensure the report is thorough and professional, with clear explanations and actionable insights tailored to the observed workspace conditions.`
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
      "positive_impacts": [<string array>],
      "negative_impacts": [<string array>],
      "score": <number>,
      "score_justification": <string>,
      "specific_improvements": [<string array>],
      "recommended_tools": [<string array>]
    },
    "set_in_order": {
      "observations": [<string array>],
      "positive_impacts": [<string array>],
      "negative_impacts": [<string array>],
      "score": <number>,
      "score_justification": <string>,
      "specific_improvements": [<string array>],
      "recommended_tools": [<string array>]
    },
    "shine": {
      "observations": [<string array>],
      "positive_impacts": [<string array>],
      "negative_impacts": [<string array>],
      "score": <number>,
      "score_justification": <string>,
      "specific_improvements": [<string array>],
      "recommended_tools": [<string array>]
    },
    "standardize": {
      "observations": [<string array>],
      "positive_impacts": [<string array>],
      "negative_impacts": [<string array>],
      "score": <number>,
      "score_justification": <string>,
      "specific_improvements": [<string array>],
      "recommended_tools": [<string array>]
    },
    "sustain": {
      "observations": [<string array>],
      "positive_impacts": [<string array>],
      "negative_impacts": [<string array>],
      "score": <number>,
      "score_justification": <string>,
      "specific_improvements": [<string array>],
      "recommended_tools": [<string array>]
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
        response_format: { type: "json_object" }
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