import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { analyzeImageWithAI } from './analysis.ts';
import { calculateTotalScore } from './scoring.ts';

const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrls } = await req.json();
    console.log(`Processing ${imageUrls.length} images`);

    const analyses = [];
    for (const url of imageUrls) {
      try {
        console.log('Fetching image:', url);
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Failed to fetch image: ${response.status}`);
        }
        
        const buffer = await response.arrayBuffer();
        const bytes = new Uint8Array(buffer);
        const base64Image = btoa(String.fromCharCode.apply(null, bytes));
        
        console.log('Analyzing image with Anthropic');
        const analysis = await analyzeImageWithAI(base64Image, anthropicApiKey || '');
        analyses.push(analysis);
      } catch (error) {
        console.error('Error processing image:', error);
        throw error;
      }
    }

    // Consolidate analyses across all images
    const consolidatedAnalysis = {
      sort_score: Math.round(analyses.reduce((sum, a) => sum + a.scores.sort_score, 0) / analyses.length * 10) / 10,
      set_in_order_score: Math.round(analyses.reduce((sum, a) => sum + a.scores.set_in_order_score, 0) / analyses.length * 10) / 10,
      shine_score: Math.round(analyses.reduce((sum, a) => sum + a.scores.shine_score, 0) / analyses.length * 10) / 10,
      standardize_score: Math.round(analyses.reduce((sum, a) => sum + a.scores.standardize_score, 0) / analyses.length * 10) / 10,
      sustain_score: Math.round(analyses.reduce((sum, a) => sum + a.scores.sustain_score, 0) / analyses.length * 10) / 10,
      safety_deduction: Math.min(...analyses.map(a => a.scores.safety_deduction)),
      strengths: [...new Set(analyses.flatMap(a => a.strengths))],
      weaknesses: [...new Set(analyses.flatMap(a => a.findings))],
      opportunities: [...new Set(analyses.flatMap(a => a.opportunities))],
      threats: [...new Set(analyses.flatMap(a => a.actions))]
    };

    const totalScore = calculateTotalScore(consolidatedAnalysis);
    consolidatedAnalysis.total_score = totalScore;

    console.log('Analysis completed successfully');
    return new Response(
      JSON.stringify(consolidatedAnalysis),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-5s-images function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    );
  }
});