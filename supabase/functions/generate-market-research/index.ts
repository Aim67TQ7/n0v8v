import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic, userName, companyName } = await req.json();

    const systemPrompt = `You are a Harvard-level doctorate in market research, tasked with independently producing a comprehensive, credible, and data-rich market research white paper. The final report will adhere to academic standards, structured with clear sections and actionable insights.`;

    const userPrompt = `Create a detailed market research report on "${topic}" for ${userName} at ${companyName}. Include the following sections:

1. Executive Summary
2. Market Overview (size, growth rates, dynamics)
3. Segmentation and Target Market Analysis
4. Competitive Analysis & SWOT Analysis
5. Consumer Insights and Trends
6. Strategic Recommendations
7. Market Forecasts and Projections
8. Conclusion

Use current market data and trends. Format the report professionally with clear section headers.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
        max_tokens: 4000
      }),
    });

    const data = await response.json();
    const report = data.choices[0].message.content;

    return new Response(report, {
      headers: { ...corsHeaders, 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});