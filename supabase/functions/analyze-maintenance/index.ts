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
    const { imageData, companyId, equipmentDetails } = await req.json();
    console.log('Processing request for equipment analysis');

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Create a detailed system prompt using the equipment details
    const systemPrompt = `You are an expert in industrial equipment maintenance, specializing in analyzing equipment images and documentation. 
    Analyze the equipment in the images and provided details to:
    1. Identify the equipment (make, model, manufacturer)
    2. Search for and identify relevant product manuals and documentation
    3. Assess current condition
    4. Provide detailed maintenance recommendations
    5. List required tools and skills
    6. Outline safety precautions
    7. Suggest maintenance intervals
    
    Equipment details provided: ${equipmentDetails}`;

    console.log('Sending request to Perplexity');

    // Process each image with Perplexity
    const analysisPromises = imageData.map(async (base64Image: string) => {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('PERPLEXITY_API_KEY')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-large-128k-online',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: "Analyze this equipment image and provide detailed maintenance recommendations."
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                }
              ]
            }
          ],
          temperature: 0.2,
          max_tokens: 1000
        })
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      return await response.json();
    });

    const analysisResults = await Promise.all(analysisPromises);
    console.log('Analysis completed successfully');

    // Combine and process all analysis results
    const combinedAnalysis = analysisResults.map(result => result.choices[0].message.content);
    
    // Extract equipment information from the analysis
    const makeMatch = combinedAnalysis[0].match(/make:?\s*([^\n]+)/i);
    const modelMatch = combinedAnalysis[0].match(/model:?\s*([^\n]+)/i);
    const manufacturerMatch = combinedAnalysis[0].match(/manufacturer:?\s*([^\n]+)/i);
    const typeMatch = combinedAnalysis[0].match(/type:?\s*([^\n]+)/i);

    // Generate a unique filename for the image
    const fileName = `${crypto.randomUUID()}.jpg`;

    // Store equipment in database
    const { data: equipment, error: equipmentError } = await supabase
      .from('equipment')
      .insert({
        company_id: companyId,
        make: makeMatch?.[1]?.trim() || 'Unknown',
        model: modelMatch?.[1]?.trim() || 'Unknown',
        manufacturer: manufacturerMatch?.[1]?.trim() || 'Unknown',
        equipment_type: typeMatch?.[1]?.trim() || 'Unknown',
        image_url: fileName,
        status: 'active',
        last_maintenance_date: new Date().toISOString(),
        next_maintenance_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
      })
      .select()
      .single();

    if (equipmentError) throw equipmentError;

    // Extract maintenance tasks and schedules from the analysis
    const maintenanceTasks = combinedAnalysis
      .flatMap(analysis => 
        analysis
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
          }))
      );

    const { error: scheduleError } = await supabase
      .from('maintenance_schedules')
      .insert(maintenanceTasks);

    if (scheduleError) throw scheduleError;

    return new Response(
      JSON.stringify({ 
        message: 'Equipment analyzed and maintenance schedule created',
        equipment,
        maintenanceTasks,
        analysis: combinedAnalysis
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