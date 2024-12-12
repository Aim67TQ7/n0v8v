import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, selectedArea, companyId, equipmentDetails } = await req.json();
    console.log('Processing request for image:', imageUrl);

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Get the image data from storage
    const { data: imageData, error: storageError } = await supabase.storage
      .from('process-images')
      .download(imageUrl);

    if (storageError) {
      console.error('Storage error:', storageError);
      throw new Error('Failed to download image from storage');
    }

    // Get the file extension and determine MIME type
    const fileExt = imageUrl.split('.').pop()?.toLowerCase() || 'jpeg';
    const mimeType = fileExt === 'jpg' ? 'jpeg' : fileExt;

    // Convert the image to base64
    const imageArrayBuffer = await imageData.arrayBuffer();
    const base64Image = btoa(
      String.fromCharCode(...new Uint8Array(imageArrayBuffer))
    );

    console.log('Image processed, sending to OpenAI');

    // Create a detailed system prompt using the equipment details
    const systemPrompt = `You are an expert in industrial equipment maintenance, specializing in analyzing equipment images. 
    Analyze the equipment in the image and provide detailed maintenance recommendations.
    Equipment details provided: ${equipmentDetails}
    
    Provide your analysis in the following format:
    1. Equipment identification (make, model, manufacturer if visible)
    2. Current condition assessment
    3. Maintenance recommendations
    4. Required tools and skills
    5. Safety precautions
    6. Estimated maintenance intervals`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: systemPrompt
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this equipment image and provide detailed maintenance recommendations."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/${mimeType};base64,${base64Image}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${response.status} - ${errorText}`);
    }

    const analysisResult = await response.json();
    console.log('Analysis completed successfully');

    if (!analysisResult.choices || !analysisResult.choices[0]) {
      throw new Error('Invalid response from OpenAI API');
    }

    const aiResponse = analysisResult.choices[0].message.content;
    
    const makeMatch = aiResponse.match(/make:?\s*([^\n]+)/i);
    const modelMatch = aiResponse.match(/model:?\s*([^\n]+)/i);
    const manufacturerMatch = aiResponse.match(/manufacturer:?\s*([^\n]+)/i);
    const typeMatch = aiResponse.match(/type:?\s*([^\n]+)/i);

    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .insert({
        company_id: companyId,
        make: makeMatch?.[1]?.trim() || 'Unknown',
        model: modelMatch?.[1]?.trim() || 'Unknown',
        manufacturer: manufacturerMatch?.[1]?.trim() || 'Unknown',
        equipment_type: typeMatch?.[1]?.trim() || 'Unknown',
        image_url: imageUrl,
        status: 'active',
        last_maintenance_date: new Date().toISOString(),
        next_maintenance_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (equipmentError) throw equipmentError;

    const maintenanceTasks = aiResponse
      .split('\n')
      .filter(line => line.includes('maintenance') || line.includes('inspect'))
      .map(task => ({
        equipment_id: equipment.id,
        task_description: task.trim(),
        frequency: 'weekly',
        skill_level: 'intermediate',
        tools_needed: ['basic hand tools'],
        estimated_time: null,
        is_critical: false,
        safety_precautions: ['wear appropriate PPE'],
        procedure_steps: ['inspect equipment', 'perform maintenance', 'document results']
      }));

    const { error: scheduleError } = await supabase
      .from('maintenance_schedules')
      .insert(maintenanceTasks);

    if (scheduleError) throw scheduleError;

    return new Response(
      JSON.stringify({ 
        message: 'Equipment analyzed and maintenance schedule created',
        equipment,
        maintenanceTasks,
        analysis: aiResponse
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in analyze-maintenance function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
})