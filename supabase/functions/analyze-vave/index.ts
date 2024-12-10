import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const formData = await req.formData();
    const imageFile = formData.get('image');
    const valueChecksStr = formData.get('valueChecks');
    const selectedAreaStr = formData.get('selectedArea');

    if (!imageFile || !valueChecksStr) {
      throw new Error('Missing required fields');
    }

    const valueChecks = JSON.parse(valueChecksStr as string);
    const selectedArea = selectedAreaStr ? JSON.parse(selectedAreaStr as string) : null;

    console.log('Converting image to base64');
    const imageArrayBuffer = await (imageFile as File).arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageArrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );

    console.log('Preparing Anthropic request');
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `You are a manufacturing process expert conducting a Value Analysis and Value Engineering (VAVE) review. 
                Analyze the provided image ${selectedArea ? 'focusing on the highlighted area' : ''} and provide a comprehensive analysis with the following structure:

                1. Current Process Overview:
                   - Detailed description of the current manufacturing process or design
                   - Key characteristics and potential inefficiencies

                2. Value Enhancement Opportunities:
                   - Specific, actionable improvements for:
                     * Process efficiency
                     * Cost reduction
                     * Quality improvement
                     * Material optimization
                     * Design simplification
                   - Quantify benefits where possible (e.g., estimated time/cost savings)

                3. Implementation Roadmap:
                   - Step-by-step implementation plan
                   - Required resources and timeline estimates
                   - Potential challenges and mitigation strategies

                Be creative but practical in your recommendations. Focus on specific, measurable improvements rather than general suggestions.
                Format your response with clear sections and bullet points for readability.`
              },
              {
                type: 'image',
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ]
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      throw new Error(`Anthropic API error: ${response.status} - ${errorData}`);
    }

    const data = await response.json();
    console.log('Successfully received Anthropic response');

    if (!data.content || !data.content[0] || !data.content[0].text) {
      console.error('Unexpected Anthropic response structure:', data);
      throw new Error('Invalid response structure from Anthropic API');
    }

    const analysisText = data.content[0].text;

    const analysis = {
      status: 'success',
      message: '✅ VAVE Analysis completed successfully',
      details: analysisText
    };

    return new Response(
      JSON.stringify({ data: { analysis } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-vave function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});