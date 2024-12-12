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
    console.log('Processing request for part analysis');
    const formData = await req.formData();
    
    const imageFile = formData.get('image');
    const workcenter = formData.get('workcenter');
    const analysisTypeId = formData.get('analysisTypeId');
    const selectedAreaStr = formData.get('selectedArea');

    console.log('Received parameters:', {
      hasImage: !!imageFile,
      workcenter,
      analysisTypeId,
      hasSelectedArea: !!selectedAreaStr
    });

    if (!imageFile || !analysisTypeId) {
      throw new Error('Missing required fields');
    }

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    console.log('Supabase client initialized');

    // Fetch analysis type details
    console.log('Fetching analysis type:', analysisTypeId);
    const { data: analysisType, error: analysisError } = await supabase
      .from('analysis_types')
      .select('prompt_template')
      .eq('id', analysisTypeId)
      .single();

    if (analysisError) {
      console.error('Analysis type fetch error:', analysisError);
      throw new Error(`Failed to fetch analysis type: ${analysisError.message}`);
    }

    if (!analysisType) {
      console.error('No analysis type found for ID:', analysisTypeId);
      throw new Error('Analysis type not found');
    }

    console.log('Successfully fetched analysis type');

    // Upload image to storage
    const fileExt = (imageFile as File).name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('process-images')
      .upload(fileName, imageFile);

    if (uploadError) {
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('process-images')
      .getPublicUrl(fileName);

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
                text: `First, provide a concise name for the part shown in the image, focusing on its apparent function and key characteristics. Then, ${analysisType.prompt_template} ${
                  selectedArea ? 'Focus specifically on the highlighted area.' : ''
                }
                
                If you don't see any issues, explicitly state that no problems were identified.
                
                Provide your analysis covering:
                1. Quality Assessment: Document your findings based on the analysis criteria
                2. Impact Analysis: If issues are found, explain their potential impact
                3. Recommendations: Suggest specific improvements or actions if needed
                4. Compliance Status: State whether the part meets quality standards
                
                If no issues are found, respond with a clear statement that the part meets all quality criteria for this analysis type.
                
                Format your response with the part name on the first line, followed by your analysis in clear, concise bullet points.`
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
    const [partName, ...analysisLines] = analysisText.split('\n').filter(line => line.trim());
    const analysisDetails = analysisLines.join('\n');

    const noIssuesFound = analysisDetails.toLowerCase().includes('no issues') || 
                         analysisDetails.toLowerCase().includes('meets all quality criteria') ||
                         analysisDetails.toLowerCase().includes('no problems') ||
                         analysisDetails.toLowerCase().includes('no visible quality concerns');

    const analysis = {
      status: noIssuesFound ? 'success' : 'concerns',
      message: noIssuesFound ? 
        '✅ Part meets quality standards for this analysis type.' : 
        '⚠️ Quality concerns identified during analysis.',
      details: analysisDetails,
      partName: partName.trim(),
      imageUrl: publicUrl
    };

    return new Response(
      JSON.stringify({ data: { analysis } }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-process function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error.stack
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});