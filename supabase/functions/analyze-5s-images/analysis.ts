import { Score, calculateSafetyDeduction } from './scoring.ts';

export const analyzeImageWithAI = async (
  base64Image: string,
  openAIApiKey: string
): Promise<{
  scores: Score;
  findings: string[];
  opportunities: string[];
  strengths: string[];
  actions: string[];
}> => {
  const systemPrompt = `You are a 5S workplace organization expert analyzing workplace images. Focus ONLY on what you can actually see in the images.

For each 5S principle, provide a score from 0-10 based on visible evidence:

Sort (Seiri):
- Look for unnecessary items, clutter, or excess materials
- Check if only essential tools and materials are present
- Identify any obvious waste or excess inventory

Set in Order (Seiton):
- Observe if items have designated storage locations
- Check if tools and materials are arranged logically
- Look for visual management systems (labels, shadows, markings)

Shine (Seiso):
- Assess cleanliness of equipment, floors, and surfaces
- Look for signs of regular cleaning
- Check for any dirt, dust, or debris

Standardize (Seiketsu):
- Look for visual standards or procedures posted
- Check for consistent organization methods
- Observe if 5S practices appear to be maintained

Sustain (Shitsuke):
- Look for evidence of regular audits or checklists
- Check if improvements appear to be maintained
- Observe signs of continuous improvement

Safety concerns should be noted separately and categorized by severity:
- Severe safety hazard: Immediate risk of injury
- Moderate safety concern: Potential risk requiring attention
- Minor safety issue: Low-risk situation needing improvement

For each finding, provide:
1. The specific issue observed
2. The impact on operations
3. A clear, actionable solution with expected benefits

Provide your response in valid JSON format with these exact fields:
{
  "sort_score": number (0-10),
  "set_in_order_score": number (0-10),
  "shine_score": number (0-10),
  "standardize_score": number (0-10),
  "sustain_score": number (0-10),
  "strengths": string[],
  "findings": string[],
  "opportunities": string[],
  "actions": string[]
}`;

  try {
    console.log('Sending request to OpenAI API');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { 
            role: 'user',
            content: [
              { type: 'text', text: 'Analyze this workplace image for 5S implementation.' },
              { 
                type: 'image', 
                source: {
                  type: 'base64',
                  media_type: 'image/jpeg',
                  data: base64Image
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      console.error('OpenAI API error:', response.status, await response.text());
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('OpenAI API response:', data);
    
    const analysis = JSON.parse(data.choices[0].message.content);
    const safety_deduction = calculateSafetyDeduction(analysis.findings);

    return {
      scores: {
        sort_score: analysis.sort_score,
        set_in_order_score: analysis.set_in_order_score,
        shine_score: analysis.shine_score,
        standardize_score: analysis.standardize_score,
        sustain_score: analysis.sustain_score,
        safety_deduction
      },
      findings: analysis.findings,
      opportunities: analysis.opportunities,
      strengths: analysis.strengths,
      actions: analysis.actions
    };
  } catch (error) {
    console.error('Error analyzing image:', error);
    throw error;
  }
};