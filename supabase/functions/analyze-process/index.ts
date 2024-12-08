import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const formData = await req.formData()
    const image = formData.get('image') as File
    const workcenter = formData.get('workcenter')

    if (!image || !workcenter) {
      throw new Error('Image and workcenter are required')
    }

    // Upload image to Supabase Storage
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const fileExt = image.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('process-images')
      .upload(fileName, image)

    if (uploadError) throw uploadError

    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('process-images')
      .getPublicUrl(fileName)

    // Call Anthropic API for analysis
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') ?? '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1024,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'text',
              text: `Analyze this manufacturing process image from workcenter ${workcenter}. Focus on:
              1. Identify any quality issues or discrepancies
              2. Explain how these issues impact downstream operations
              3. Provide specific, actionable improvements
              Be concise and specific. Format as bullet points.`
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
    })

    const analysisData = await response.json()
    
    // Store the analysis in Supabase
    const { error: dbError } = await supabase
      .from('process_improvements')
      .insert({
        workcenter_id: workcenter,
        image_url: publicUrl,
        analysis: analysisData.content[0].text,
        created_at: new Date().toISOString()
      })

    if (dbError) throw dbError

    return new Response(
      JSON.stringify({ 
        analysis: analysisData.content[0].text,
        imageUrl: publicUrl 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})