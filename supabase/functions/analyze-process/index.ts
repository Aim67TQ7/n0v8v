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
    
    // Extract and validate required fields
    const imageFile = formData.get('image');
    const workcenter = formData.get('workcenter');
    const selectedAreaStr = formData.get('selectedArea');

    if (!imageFile || !workcenter) {
      throw new Error('Missing required fields: image and workcenter are required');
    }

    console.log('Converting image to base64');
    // Convert image to base64 efficiently
    const imageArrayBuffer = await (imageFile as File).arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageArrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    const selectedArea = selectedAreaStr ? JSON.parse(selectedAreaStr as string) : null;
    
    console.log('Preparing OpenAI request');
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
                  selectedArea ? 'Focus specifically on the highlighted area.' : ''
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
                  url: `data:image/jpeg;base64,${base64Image}`,
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
    console.log('Successfully received OpenAI response');

    if (!data.choices?.[0]?.message?.content) {
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
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});