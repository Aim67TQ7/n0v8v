import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Processing request for part analysis');
    const formData = await req.formData();
    
    const imageFile = formData.get('image') as File;
    const workcenter = formData.get('workcenter');
    const selectedAreaStr = formData.get('selectedArea');

    if (!imageFile) {
      throw new Error('No image file provided');
    }

    console.log('Converting image to base64');
    const imageArrayBuffer = await imageFile.arrayBuffer();
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(imageArrayBuffer)));

    // Get file extension and MIME type
    const fileName = imageFile.name;
    const fileExt = fileName.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`;
    
    const selectedArea = selectedAreaStr ? JSON.parse(selectedAreaStr as string) : null;

    console.log('Preparing Anthropic request');
    const anthropicResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-3-sonnet-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this part image ${selectedArea ? 'focusing specifically on the highlighted area.' : ''}\n\nProvide your analysis covering:\n1. Quality Assessment\n2. Impact Analysis\n3. Recommendations\n4. Compliance Status\n\nIf no issues are found, respond with a clear statement that the part meets all quality criteria.\n\nFormat your response in clear, concise paragraphs.`
            },
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mimeType,
                data: base64Image
              }
            }
          ]
        }]
      })
    });

    if (!anthropicResponse.ok) {
      const errorText = await anthropicResponse.text();
      console.error('Anthropic API error:', errorText);
      throw new Error(`Anthropic API error: ${anthropicResponse.status} - ${errorText}`);
    }

    const anthropicData = await anthropicResponse.json();
    console.log('Successfully received Anthropic response');

    if (!anthropicData.content || !anthropicData.content[0] || !anthropicData.content[0].text) {
      console.error('Unexpected Anthropic response structure:', anthropicData);
      throw new Error('Invalid response structure from Anthropic API');
    }

    const analysisText = anthropicData.content[0].text;
    const noIssuesFound = analysisText.toLowerCase().includes('no issues') || 
                         analysisText.toLowerCase().includes('meets all quality criteria') ||
                         analysisText.toLowerCase().includes('no problems') ||
                         analysisText.toLowerCase().includes('no visible quality concerns');

    const analysis = {
      status: noIssuesFound ? 'success' : 'concerns',
      message: noIssuesFound ? 
        '✅ Part meets quality standards for this inspection type.' : 
        '⚠️ Quality concerns identified during inspection.',
      details: analysisText
    };

    return new Response(
      JSON.stringify({ data: { analysis } }),
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