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
    { name: 'Sort', score: sortScore, description: 'Organization of materials and removal of unnecessary items' },
    { name: 'Set in Order', score: setScore, description: 'Efficient arrangement of necessary items' },
    { name: 'Shine', score: shineScore, description: 'Workplace cleanliness and maintenance' },
    ...(canShowAdvancedScores ? [
      { name: 'Standardize', score: standardizeScore, description: 'Consistent processes and visual management' },
      { name: 'Sustain', score: sustainScore, description: 'Long-term maintenance of 5S practices' }
    ] : [])
  ];

  return (
    <>
      {categories.map(({ name, score, description }) => (
        <Card key={name} className="p-4">
          <h4 className="font-medium mb-2">
            {name} ({score}/10)
          </h4>
          <p className="text-sm text-muted-foreground mb-3">{description}</p>
          <ul className="list-disc pl-5 space-y-2">
            {weaknesses
              .filter(w => w.toLowerCase().includes(name.toLowerCase()))
              .map((item, i) => (
                <li key={i} className="text-sm text-gray-700">
                  {formatImprovementSuggestion(item, name)}
                </li>
              ))}
          </ul>
        </Card>
      ))}

      {!canShowAdvancedScores && (
        <div className="col-span-4 bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            Standardize and Sustain scores will be available once Sort, Set in Order, and Shine scores total 20 points or more.
          </p>
        </div>
      )}
    </>
  );
};