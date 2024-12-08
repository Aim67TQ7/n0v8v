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
    
    const imageFile = formData.get('image');
    const workcenter = formData.get('workcenter');
    const selectedAreaStr = formData.get('selectedArea');

    if (!imageFile || !workcenter) {
      throw new Error('Missing required fields: image and workcenter are required');
    }

    console.log('Converting image to base64');
    const imageArrayBuffer = await (imageFile as File).arrayBuffer();
    const base64Image = btoa(
      new Uint8Array(imageArrayBuffer)
        .reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
    
    const selectedArea = selectedAreaStr ? JSON.parse(selectedAreaStr as string) : null;
    
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
                text: `Analyze this manufacturing process image from workcenter ${workcenter}. ${
                  selectedArea ? 'Focus specifically on the highlighted area.' : ''
                }
                
                Look for any quality issues, process inconsistencies, or areas of concern. If you don't see any issues, explicitly state that no problems were identified.
                
                Provide your analysis covering:
                1. Quality Issues: Identify any visible quality concerns or process inconsistencies
                2. Impact Analysis: Explain how these issues affect downstream operations or product quality
                3. Improvement Recommendations: Suggest specific, actionable improvements
                4. Expected Benefits: Outline the anticipated benefits of implementing the suggested improvements
                
                If no issues are found, respond with a clear statement that the process appears to be running correctly with no visible quality concerns.
                
                Format your response in clear, concise bullet points.`
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
    const noIssuesFound = analysisText.toLowerCase().includes('no issues') || 
                         analysisText.toLowerCase().includes('no problems') ||
                         analysisText.toLowerCase().includes('no visible quality concerns');

    // Format the response to include a status indicator
    const analysis = {
      status: noIssuesFound ? 'success' : 'concerns',
      message: noIssuesFound ? 
        '✅ No quality issues or process concerns identified in the analyzed area.' : 
        '⚠️ Some areas of improvement identified.',
      details: analysisText
    };

    return new Response(
      JSON.stringify(analysis),
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