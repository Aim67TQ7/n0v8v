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
    const systemPrompt = `You are an expert in industrial equipment maintenance and documentation. 
    Analyze the provided equipment details and/or images to:
    1. Identify the equipment (make, model, manufacturer)
    2. Find relevant product manuals and documentation
    3. Assess current condition if images are provided
    4. Provide detailed maintenance recommendations
    5. List required tools and skills
    6. Outline safety precautions
    7. Suggest maintenance intervals
    8. Find manufacturer contact information and support resources
    
    If manuals cannot be found, provide alternative manufacturer contact methods and support resources.
    Format your response as a detailed JSON object with all findings.
    
    Equipment details provided: ${equipmentDetails}`;

    console.log('Sending request to OpenAI');

    // Process each image with OpenAI Vision
    const analysisPromises = imageData.map(async (base64Image: string) => {
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
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: "Analyze this equipment image and provide detailed maintenance recommendations. If possible, identify any text visible in the image that could help locate manuals or documentation."
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
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.status}`);
      }

      return await response.json();
    });

    const analysisResults = await Promise.all(analysisPromises);
    console.log('Analysis completed successfully');

    // Combine and process all analysis results
    const combinedAnalysis = analysisResults.map(result => result.choices[0].message.content);
    
    // Extract equipment information and resources
    const makeMatch = combinedAnalysis[0].match(/make:?\s*([^\n]+)/i);
    const modelMatch = combinedAnalysis[0].match(/model:?\s*([^\n]+)/i);
    const manufacturerMatch = combinedAnalysis[0].match(/manufacturer:?\s*([^\n]+)/i);
    const typeMatch = combinedAnalysis[0].match(/type:?\s*([^\n]+)/i);
    const manualUrlMatch = combinedAnalysis[0].match(/manual url:?\s*([^\n]+)/i);
    const manufacturerWebsiteMatch = combinedAnalysis[0].match(/manufacturer website:?\s*([^\n]+)/i);
    const supportUrlMatch = combinedAnalysis[0].match(/support url:?\s*([^\n]+)/i);

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
        manual_url: manualUrlMatch?.[1]?.trim(),
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

    // Prepare the response with all findings
    const response = {
      equipment: {
        make: makeMatch?.[1]?.trim(),
        model: modelMatch?.[1]?.trim(),
        type: typeMatch?.[1]?.trim(),
      },
      manualUrl: manualUrlMatch?.[1]?.trim(),
      manufacturerInfo: {
        name: manufacturerMatch?.[1]?.trim(),
        website: manufacturerWebsiteMatch?.[1]?.trim(),
        support: supportUrlMatch?.[1]?.trim(),
      },
      maintenanceSchedule: maintenanceTasks,
      alternativeResources: combinedAnalysis
        .flatMap(analysis => 
          analysis.match(/https?:\/\/[^\s]+/g) || []
        )
        .filter(url => 
          url.includes('manual') || 
          url.includes('support') || 
          url.includes('documentation')
        )
        .slice(0, 3)
    };

    return new Response(
      JSON.stringify(response),
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