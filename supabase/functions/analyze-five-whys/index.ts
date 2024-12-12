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

    console.log('Analyzing with inputs:', { problemStatement, answers, generateFishbone });

    const openAIResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('GROQ_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mixtral-8x7b-32768',
        messages: [
          {
            role: 'system',
            content: generateFishbone
              ? `You are an expert in root cause analysis. Based on the problem statement and the series of "why" answers provided, generate:
                 1. A clear, concise root cause statement (2-3 sentences max)
                 2. A comprehensive solution that addresses:
                    - Immediate corrective actions (3-4 specific steps)
                    - Systemic changes needed (2-3 major changes)
                    - Prevention measures (2-3 key measures)
                    - Implementation steps (3-4 concrete steps)
                 
                 Format your response in clear sections, being specific and actionable.`
              : `You are an expert in root cause analysis conducting a Five Whys investigation. 
                 Based on the previous answer, generate five specific, probing "why" questions that:
                 - Build directly from the previous answer
                 - Are specific and actionable
                 - Focus on systems and processes
                 - Avoid assumptions
                 Each question should explore different potential aspects of the previous answer.
                 
                 Consider: process issues, equipment problems, training gaps, communication issues, and resource constraints.`
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
                 Previous answer: ${answers.length > 0 ? answers[answers.length - 1] : problemStatement}
                 Generate 5 probing "why" questions that explore different potential root causes.`
          }
        ],
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!openAIResponse.ok) {
      const errorText = await openAIResponse.text();
      console.error('Groq API error:', {
        status: openAIResponse.status,
        statusText: openAIResponse.statusText,
        error: errorText
      });
      throw new Error(`Groq API error: ${openAIResponse.status} - ${errorText}`);
    }

    const data = await openAIResponse.json();
    console.log('Groq API response:', data);

    if (generateFishbone) {
      // Parse the structured response
      const response = data.choices[0].message.content;
      const sections = response.split('\n\n');
      
      const analysis = {
        rootCause: sections[0].replace('Root Cause: ', '').trim(),
        correctiveActions: sections[1].replace('Comprehensive Solution:', '')
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((action: string) => action.replace(/^[•-]\s*/, '').trim()),
        preventiveActions: sections[2].replace('Prevention Measures:', '')
          .split('\n')
          .filter((line: string) => line.trim().length > 0)
          .map((action: string) => action.replace(/^[•-]\s*/, '').trim()),
        fishboneDiagram: `Problem: ${problemStatement}\n\nRoot Causes:\n${answers.map((a: string, i: number) => `${i + 1}. ${a}`).join('\n')}`
      };

      return new Response(JSON.stringify({ result: analysis }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // For regular iterations, parse and return the questions
    const questions = data.choices[0].message.content
      .split('\n')
      .filter((q: string) => q.trim().length > 0 && q.includes('?'))
      .map((q: string) => q.replace(/^\d+\.\s*/, '').trim());

    return new Response(JSON.stringify({ questions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in analyze-five-whys function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});