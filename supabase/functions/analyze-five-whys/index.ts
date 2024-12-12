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
    const { problemStatement, answers, generateFishbone } = await req.json();

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: generateFishbone
              ? `You are an expert in root cause analysis. Based on the problem statement and the series of "why" answers provided, generate:
                 1. A clear, concise root cause statement (2-3 sentences max)
                 2. A comprehensive solution that addresses:
                    - Immediate corrective actions
                    - Systemic changes needed
                    - Prevention measures
                    - Implementation steps
                 
                 Format your response in clear sections, being specific and actionable.`
              : `You are an expert in root cause analysis conducting a Five Whys investigation. 
                 Analyze the previous responses and generate five specific, probing "why" questions that:
                 - Build directly from the previous answer
                 - Are specific and actionable
                 - Focus on systems and processes
                 - Avoid assumptions without evidence
                 Each question should explore different aspects of the problem.`
          },
          {
            role: 'user',
            content: generateFishbone
              ? `Problem: "${problemStatement}"
                 Five Whys Analysis:
                 ${answers.map((a: string, i: number) => `Why ${i + 1}: ${a}`).join('\n')}
                 
                 Please provide:
                 1. Root Cause Analysis
                 2. Comprehensive Solution`
              : `Problem: "${problemStatement}"
                 Previous answers: ${JSON.stringify(answers)}
                 Generate 5 probing "why" questions that explore different potential root causes.`
          }
        ],
      }),
    });

    const data = await openAIResponse.json();
    const result = data.choices[0].message.content;

    if (generateFishbone) {
      // Parse the structured response
      const sections = result.split('\n\n');
      const analysis = {
        rootCause: sections[0].replace('Root Cause: ', ''),
        correctiveActions: sections[1].replace('Comprehensive Solution:\n', '').split('\n'),
        preventiveActions: sections[2].replace('Prevention Measures:\n', '').split('\n'),
        keyLearnings: sections[3].replace('Implementation Steps:\n', '').split('\n'),
        fishboneDiagram: `Problem: ${problemStatement}\n\nRoot Causes:\n${answers.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}`
      };

      return new Response(JSON.stringify({ result: analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For regular iterations, parse and return the questions
    const questions = result.split('\n').filter(q => q.trim().length > 0);
    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-five-whys function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});