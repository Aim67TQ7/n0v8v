import { serve } from "std/http/server";
import { Anthropic } from "anthropic";
import { ImageAnalysis } from "./types";

const analyzeImage = async (imageUrl: string): Promise<ImageAnalysis> => {
  const anthropic = new Anthropic({
    apiKey: Deno.env.get('ANTHROPIC_API_KEY') || '',
  });

  const message = await anthropic.messages.create({
    model: "claude-3-sonnet-20240229",
    max_tokens: 1000,
    temperature: 0.5,
    system: "You are an expert in 5S workplace organization methodology. Analyze the provided image and identify key aspects related to Sort, Set in Order, Shine, Standardize, and Sustain principles.",
    messages: [{
      role: "user",
      content: `Analyze this workplace image (${imageUrl}) for 5S compliance. Focus on visible organization, cleanliness, and standardization. Provide specific observations and recommendations.`
    }]
  });

  const responseContent = message.choices[0].message.content;
  const analysis: ImageAnalysis = JSON.parse(responseContent);
  return analysis;
};

serve(async (req) => {
  const { imageUrl } = await req.json();
  const analysis = await analyzeImage(imageUrl);
  return new Response(JSON.stringify(analysis), {
    headers: { "Content-Type": "application/json" },
  });
});
