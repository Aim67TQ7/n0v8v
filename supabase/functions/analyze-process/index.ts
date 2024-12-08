import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    console.log('Uploading image to Supabase Storage');
    const fileExt = image.name.split('.').pop();
    const fileName = `${crypto.randomUUID()}.${fileExt}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('process-images')
      .upload(fileName, image);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('process-images')
      .getPublicUrl(fileName);

    console.log('Image uploaded successfully, analyzing with Anthropic');

    // Call Anthropic API for analysis
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this manufacturing process image from workcenter ${workcenter}. ${
                selectedArea ? 'Focus specifically on the selected area in the image.' : ''
              }
              
              Provide a detailed analysis covering:
              1. Quality Issues: Identify any visible quality concerns or process inconsistencies
              2. Impact Analysis: Explain how these issues affect downstream operations or product quality
              3. Improvement Recommendations: Suggest specific, actionable improvements
              4. Expected Benefits: Outline the anticipated benefits of implementing the suggested improvements
              
              Format your response in clear, concise bullet points.`
            },
            {
              type: 'image',
              source: {
                type: 'url',
                url: publicUrl
              }
            }
          ]
        }]
      })
    });

    if (!response.ok) {
      console.error('Anthropic API error:', await response.text());
      throw new Error('Failed to analyze image with Anthropic API');
    }

    const analysisData = await response.json();
    console.log('Analysis completed successfully');

    // Store the analysis in Supabase
    const { error: dbError } = await supabase
      .from('process_improvements')
      .insert({
        workcenter_id: workcenter,
        image_url: publicUrl,
        analysis: analysisData.content[0].text,
      });

    if (dbError) {
      console.error('Database insert error:', dbError);
      throw dbError;
    }

    return new Response(
      JSON.stringify({ 
        analysis: analysisData.content[0].text,
        imageUrl: publicUrl 
      }),
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