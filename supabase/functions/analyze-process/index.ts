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
    console.log('Processing request for process analysis');
    const formData = await req.formData();
    const image = formData.get('image') as File;
    const workcenter = formData.get('workcenter');
    const selectedArea = formData.get('selectedArea');

    if (!image || !workcenter) {
      console.error('Missing required fields:', { image: !!image, workcenter: !!workcenter });
      throw new Error('Image and workcenter are required');
    }

    // Convert image to base64
    const arrayBuffer = await image.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));
    const imageDataUrl = `data:${image.type};base64,${base64Image}`;

    console.log('Sending request to OpenAI for image analysis');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this manufacturing process image from workcenter ${workcenter}. ${
                  selectedArea ? 'Focus specifically on the highlighted area marked in blue in the image.' : ''
                }
                
                Provide a detailed analysis covering:
                1. Quality Issues: Identify any visible quality concerns or process inconsistencies
                2. Impact Analysis: Explain how these issues affect downstream operations or product quality
                3. Improvement Recommendations: Suggest specific, actionable improvements
                4. Expected Benefits: Outline the anticipated benefits of implementing the suggested improvements
                
                Format your response in clear, concise bullet points.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageDataUrl,
                  detail: 'high'
                }
              }
            ]
          }
        ],
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('OpenAI response received:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('Unexpected OpenAI response structure:', data);
      throw new Error('Invalid response structure from OpenAI API');
    }

    const analysis = data.choices[0].message.content;

    return new Response(
      JSON.stringify({ analysis }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-process function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});