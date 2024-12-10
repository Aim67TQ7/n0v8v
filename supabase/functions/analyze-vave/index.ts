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
    console.log('Processing request for VAVE analysis');
    const formData = await req.formData();
    
    const imageFile = formData.get('image');
    const workcenter = formData.get('workcenter');
    const selectedAreaStr = formData.get('selectedArea');
    const valueChecksStr = formData.get('valueChecks');

    if (!imageFile || !workcenter || !valueChecksStr) {
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

    // Construct the analysis prompt based on selected value checks
    let analysisPrompt = `Analyze this image for Value Analysis and Value Engineering (VAVE) opportunities. ${
      selectedArea ? 'Focus specifically on the highlighted area.' : ''
    }\n\nProvide analysis for the following selected categories:\n`;

    if (valueChecks.functionalImprovements) {
      analysisPrompt += "- Functional Improvements: Evaluate potential improvements to the part's functionality\n";
    }
    if (valueChecks.manufacturingOptimization) {
      analysisPrompt += "- Manufacturing Process Optimization: Identify opportunities to optimize manufacturing processes\n";
    }
    if (valueChecks.assemblyErgonomics) {
      analysisPrompt += "- Assembly and Ergonomics: Assess assembly process and ergonomic considerations\n";
    }
    if (valueChecks.designOptimization) {
      analysisPrompt += "- Design Optimization and Standardization: Evaluate design for potential standardization and optimization\n";
    }
    if (valueChecks.materialOptimization) {
      analysisPrompt += "- Material and Thickness Optimization: Analyze material selection and thickness optimization opportunities\n";
    }

    analysisPrompt += "\nFor each category, provide specific recommendations and potential cost savings. If no improvements are identified for a category, explicitly state 'none identified'.\n\nFormat your response with clear headings for each category and bullet points for specific recommendations.";

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
                text: analysisPrompt
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

    // Process the analysis text to ensure "none identified" is used when appropriate
    const processedAnalysis = Object.keys(valueChecks).reduce((acc, category) => {
      if (valueChecks[category]) {
        const categoryText = analysisText.match(new RegExp(`${category}:.*?(?=\\n\\n|$)`, 's'));
        acc[category] = categoryText ? categoryText[0].trim() : 'None identified';
      }
      return acc;
    }, {});

    return new Response(
      JSON.stringify({ 
        data: { 
          analysis: processedAnalysis,
          rawAnalysis: analysisText
        } 
      }),
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