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
    const { problemStatement } = await req.json();

    console.log('Analyzing problem:', problemStatement);

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are an expert in root cause analysis and Ishikawa (Fishbone) diagrams. 
            Analyze problems across these categories:
            - Man/People
            - Methods/Procedures
            - Machines/Equipment
            - Materials
            - Measurements
            - Environment

            For each category, provide:
            - Primary causes (with impact levels: High/Medium/Low)
            - Secondary causes
            - Tertiary causes where relevant
            - Supporting evidence

            Return your response as a JSON object with this structure:
            {
              "categories": [
                {
                  "name": "string",
                  "primaryCauses": [
                    {
                      "cause": "string",
                      "impact": "High|Medium|Low",
                      "secondaryCauses": [
                        {
                          "cause": "string",
                          "tertiaryCauses": ["string"],
                          "evidence": "string"
                        }
                      ]
                    }
                  ]
                }
              ],
              "summary": {
                "criticalCauses": ["string"],
                "patterns": ["string"],
                "recommendations": ["string"],
                "dataGaps": ["string"]
              }
            }`
          },
          {
            role: 'user',
            content: `Please conduct a fishbone analysis for the following problem: ${problemStatement}`
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${openAIResponse.status}`);
    }

    const data = await openAIResponse.json();
    console.log('Successfully received OpenAI response');

    if (!data.choices || !data.choices[0] || !data.choices[0].message || !data.choices[0].message.content) {
      console.error('Unexpected OpenAI response structure:', data);
      throw new Error('Invalid response structure from OpenAI API');
    }

    // Parse the JSON string from the content
    const result = JSON.parse(data.choices[0].message.content);

    return new Response(JSON.stringify({ result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in analyze-fishbone function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});