import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();

    const systemPrompt = `You are a 5S workplace organization auditor and expert. Your task is to analyze images for 5S compliance and generate a detailed, structured audit report. For each category, provide at least 3-5 SPECIFIC, ACTIONABLE observations.

When analyzing images, you must:
1. Identify exact items, locations, and conditions that need attention
2. Use precise language and specific examples
3. Focus on concrete, observable details
4. Quantify issues when possible (e.g., "3 unmarked containers" rather than "several containers")
5. For each weakness, provide the exact location and specific impact

For each weakness, follow this format:
"[Category]: [Specific observation] located at/in [exact location]"

Example weaknesses:
- "Sort: 6 obsolete equipment manuals stored on top shelf of documentation cabinet"
- "Set in Order: Mixing of different bolt sizes in unlabeled bins at workstation 3"
- "Shine: Accumulated metal shavings and cutting fluid under CNC machine 2"

Important: Generate at least 3-5 specific findings for each category (Sort, Set in Order, and Shine).
If Shine score is below 8, do not evaluate Standardize and Sustain categories.`;

    const messages = [];

    // Add each image to the messages array
    imageUrls.forEach((base64Data: string, index: number) => {
      messages.push({
        role: "user",
        content: [
          {
            type: "text",
            text: `Analyze image ${index + 1} in detail for 5S compliance. Look for specific items, tools, equipment, and workspace organization. Note exact locations and conditions. Be extremely specific about what you observe - mention exact items, quantities, and locations.`
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

    // Add final message requesting specific JSON structure
    messages.push({
      role: "user",
      content: `Provide your analysis in the following JSON structure only, with no additional text or markdown. Each observation should be specific and actionable:
{
  "sort_score": <number 1-10>,
  "set_in_order_score": <number 1-10>,
  "shine_score": <number 1-10>,
  "standardize_score": <number 1-10>,
  "sustain_score": <number 1-10>,
  "strengths": [<detailed string array of specific positive observations>],
  "weaknesses": [<detailed string array of specific issues found>],
  "analysis": {
    "sort": {
      "observations": [<specific items and locations observed>],
      "score": <number>,
      "score_justification": <detailed explanation>,
      "specific_improvements": [<actionable steps>]
    },
    "set_in_order": {
      "observations": [<specific items and locations observed>],
      "score": <number>,
      "score_justification": <detailed explanation>,
      "specific_improvements": [<actionable steps>]
    },
    "shine": {
      "observations": [<specific items and locations observed>],
      "score": <number>,
      "score_justification": <detailed explanation>,
      "specific_improvements": [<actionable steps>]
    },
    "standardize": {
      "observations": [<specific items and locations observed>],
      "score": <number>,
      "score_justification": <detailed explanation>,
      "specific_improvements": [<actionable steps>]
    },
    "sustain": {
      "observations": [<specific items and locations observed>],
      "score": <number>,
      "score_justification": <detailed explanation>,
      "specific_improvements": [<actionable steps>]
    }
  }
}`
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
        temperature: 0.7,
        max_tokens: 2000
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
    }

    console.log('Received response from Anthropic');
    const result = await response.json();
    
    try {
      const analysis = JSON.parse(result.content[0].text);
      
      // Add safety deduction if any safety concerns are found
      const safetyKeywords = ['hazard', 'unsafe', 'safety', 'risk', 'danger', 'trip', 'fall', 'spill'];
      const allObservations = [
        ...analysis.analysis.sort.observations,
        ...analysis.analysis.set_in_order.observations,
        ...analysis.analysis.shine.observations,
        ...(analysis.analysis.standardize?.observations || []),
        ...(analysis.analysis.sustain?.observations || [])
      ].join(' ').toLowerCase();

      const safetyIssuesFound = safetyKeywords.some(keyword => allObservations.includes(keyword));
      if (safetyIssuesFound) {
        analysis.safety_deduction = 2;
        analysis.weaknesses.unshift("Safety concerns identified - immediate attention required");
      }

      return new Response(JSON.stringify(analysis), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    } catch (parseError) {
      console.error('Error parsing Anthropic response:', result.content[0].text);
      throw new Error('Failed to parse Anthropic response as JSON');
    }
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