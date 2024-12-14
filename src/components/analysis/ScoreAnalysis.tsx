import { Card } from "@/components/ui/card";

interface ScoreAnalysisProps {
  sortScore?: number;
  setScore?: number;
  shineScore?: number;
  standardizeScore?: number;
  sustainScore?: number;
  weaknesses: string[];
  canShowAdvancedScores: boolean;
}

export const ScoreAnalysis = ({ 
  sortScore, 
  setScore, 
  shineScore,
  standardizeScore,
  sustainScore,
  weaknesses,
  canShowAdvancedScores
}: ScoreAnalysisProps) => {
  const formatImprovementSuggestion = (weakness: string, category: string) => {
    const cleanWeakness = weakness.replace(new RegExp(`^${category}:\\s*`, 'i'), '');
    
    const impact = category === 'Sort' 
      ? 'impacting workspace efficiency and material retrieval times'
      : category === 'Set in Order'
      ? 'causing workflow disruptions and increased operation time'
      : category === 'Shine'
      ? 'affecting product quality and workplace safety standards'
      : category === 'Standardize'
      ? 'hindering consistent workplace organization'
      : 'impeding long-term 5S sustainability';

    const suggestion = cleanWeakness
      .replace(/multiple|numerous/gi, "Remove")
      .replace(/missing|lack of|no |poor/gi, "Implement")
      .replace(/disorganized|messy/gi, "Organize")
      .replace(/unclear|confusing/gi, "Establish clear");

    const firstChar = suggestion.charAt(0).toUpperCase();
    const restOfString = suggestion.slice(1).toLowerCase();
    const capitalizedSuggestion = firstChar + restOfString;

    return `${capitalizedSuggestion}. This is ${impact}.`;
  };

  const categories = [
    { name: 'Sort', score: sortScore },
    { name: 'Set in Order', score: setScore },
    { name: 'Shine', score: shineScore },
    ...(canShowAdvancedScores ? [
      { name: 'Standardize', score: standardizeScore },
      { name: 'Sustain', score: sustainScore }
    ] : [])
  ];

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-primary mb-2">5S Score Analysis</h3>
      
      <div className="space-y-6">
        {categories.map(({ name, score }) => {
          const categoryLower = name.toLowerCase();
          const categoryWeaknesses = weaknesses
            .filter(w => w.toLowerCase().includes(categoryLower))
            .map(w => formatImprovementSuggestion(w, name));
          
          return (
            <div key={name} className="border-b pb-4 last:border-0">
              <h4 className="font-medium mb-2">
                {name} ({score}/10)
              </h4>
              <ul className="list-disc pl-5 space-y-3">
                {categoryWeaknesses.map((item, i) => (
                  <li key={i} className="text-sm text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
          );
        })}

        {!canShowAdvancedScores && (
          <div className="bg-blue-50 p-4 rounded-md">
            <p className="text-sm text-blue-700">
              Standardize and Sustain scores will be available once Sort, Set in Order, and Shine scores total 20 points or more.
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};