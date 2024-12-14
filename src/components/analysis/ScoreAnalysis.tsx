import { Card } from "@/components/ui/card";

interface ScoreAnalysisProps {
  sortScore?: number;
  setScore?: number;
  shineScore?: number;
  standardizeScore?: number;
  sustainScore?: number;
  weaknesses: string[];
  canShowAdvancedScores: boolean;
  displayMode: 'primary' | 'advanced';
}

export const ScoreAnalysis = ({ 
  sortScore, 
  setScore, 
  shineScore,
  standardizeScore,
  sustainScore,
  weaknesses,
  canShowAdvancedScores,
  displayMode
}: ScoreAnalysisProps) => {
  const getScoreClass = (score: number) => {
    if (score <= 3) return 'bg-red-100 text-red-800';
    if (score <= 5) return 'bg-orange-100 text-orange-800';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

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

  const categories = displayMode === 'primary' 
    ? [
        { 
          name: 'Sort', 
          score: sortScore, 
          description: 'Organization of materials and removal of unnecessary items',
          details: 'Focus on identifying and removing unnecessary items from the workspace. This improves efficiency and reduces clutter.',
          impact: 'Directly affects workspace efficiency and material retrieval times.'
        },
        { 
          name: 'Set in Order', 
          score: setScore, 
          description: 'Efficient arrangement of necessary items',
          details: 'Organize remaining items for optimal workflow and easy access. Everything should have a designated place.',
          impact: 'Reduces time spent searching for tools and materials.'
        },
        { 
          name: 'Shine', 
          score: shineScore, 
          description: 'Workplace cleanliness and maintenance',
          details: 'Regular cleaning and inspection of workspace and equipment. Identify and address sources of contamination.',
          impact: 'Maintains equipment reliability and workplace safety.'
        }
      ]
    : [
        { 
          name: 'Standardize', 
          score: standardizeScore, 
          description: 'Consistent processes and visual management',
          details: 'Establish clear procedures and visual controls to maintain the first three S\'s.',
          impact: 'Ensures sustainability of 5S implementation.'
        },
        { 
          name: 'Sustain', 
          score: sustainScore, 
          description: 'Long-term maintenance of 5S practices',
          details: 'Build habits and culture to maintain 5S practices over time. Regular audits and continuous improvement.',
          impact: 'Creates lasting organizational change and continuous improvement.'
        }
      ];

  return (
    <>
      {categories.map(({ name, score, description, details, impact }) => (
        <Card key={name} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-lg">{name}</h4>
            <span className={`px-3 py-1 rounded-full text-sm ${getScoreClass(score || 0)}`}>
              Score: {score}/10
            </span>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-muted-foreground">{description}</p>
              <p className="mt-2 text-sm">{details}</p>
              <p className="mt-1 text-sm font-medium text-muted-foreground">{impact}</p>
            </div>

            {weaknesses
              .filter(w => w.toLowerCase().includes(name.toLowerCase()))
              .length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2">Improvement Areas:</h5>
                <ul className="list-disc pl-5 space-y-2">
                  {weaknesses
                    .filter(w => w.toLowerCase().includes(name.toLowerCase()))
                    .map((item, i) => (
                      <li key={i} className="text-sm text-gray-700">
                        {formatImprovementSuggestion(item, name)}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </Card>
      ))}

      {!canShowAdvancedScores && displayMode === 'primary' && (
        <div className="col-span-full bg-blue-50 p-4 rounded-md">
          <p className="text-sm text-blue-700">
            Standardize and Sustain scores will be available once Sort, Set in Order, and Shine scores total 20 points or more.
          </p>
        </div>
      )}
    </>
  );
};