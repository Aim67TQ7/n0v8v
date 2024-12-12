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
    const { problemStatement, answers, iteration, generateFishbone } = await req.json();

    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: generateFishbone
              ? `You are an expert in root cause analysis. Based on the problem statement and the series of "why" answers provided, generate:
                 1. A clear root cause statement
                 2. Immediate corrective actions that should be taken
                 3. Long-term preventive measures to avoid similar issues
                 Format your response in clear sections.`
              : `You are an expert in root cause analysis conducting a Five Whys investigation. 
                 For iteration ${iteration}/5, analyze the previous response and generate follow-up "why" questions 
                 that dig deeper into the root cause. Each question should be more specific than the last iteration.`
          },
          {
            role: 'user',
            content: generateFishbone
              ? `Problem: "${problemStatement}"
                 Five Whys Answers: ${JSON.stringify(answers)}
                 Please provide:
                 1. Root Cause Analysis
                 2. Corrective Actions
                 3. Preventive Measures`
              : `Problem: "${problemStatement}"
                 Previous answers: ${JSON.stringify(answers)}
                 Generate 3 probing "why" questions for iteration ${iteration}.`
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
        correctiveActions: sections[1].replace('Corrective Actions:\n', '').split('\n'),
        preventiveActions: sections[2].replace('Preventive Measures:\n', '').split('\n'),
        fishboneDiagram: `Problem: ${problemStatement}\n\nRoot Causes:\n${answers.map((a, i) => `${i + 1}. ${a}`).join('\n')}`
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});