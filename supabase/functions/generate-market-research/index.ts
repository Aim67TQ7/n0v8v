import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { topic, userName, companyName } = await req.json();

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
            content: "You are a Harvard-level doctorate in market research, tasked with independently producing a comprehensive, credible, and data-rich market research white paper on a user-defined topic. The final report will adhere to academic standards, structured with clear sections and actionable insights."
          },
          {
            role: "user",
            content: `Create a detailed market research report on "${topic}" for ${userName} from ${companyName}. Include executive summary, market overview, segmentation analysis, competitive analysis, consumer insights, strategic recommendations, and market forecasts. Use current data and trends. Format as a professional white paper with proper citations and visual representations where appropriate.`
          }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    const data = await response.json();
    const report = data.choices[0].message.content;

    // Here you would typically format the report as a PDF
    // For now, we'll return the raw text
    return new Response(report, {
      headers: { 
        ...corsHeaders,
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});