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

  const formatFinding = (weakness: string, category: string) => {
    const cleanWeakness = weakness.replace(new RegExp(`^${category}:\\s*`, 'i'), '');
    
    const findings = {
      finding: cleanWeakness,
      impact: category === 'Sort' 
        ? 'Reduced workspace efficiency and increased material retrieval times'
        : category === 'Set in Order'
        ? 'Workflow disruptions and increased operation time'
        : category === 'Shine'
        ? 'Compromised product quality and workplace safety standards'
        : category === 'Standardize'
        ? 'Inconsistent workplace organization practices'
        : 'Unsustainable 5S implementation',
      fix: cleanWeakness
        .replace(/multiple|numerous/gi, "Remove")
        .replace(/missing|lack of|no |poor/gi, "Implement")
        .replace(/disorganized|messy/gi, "Organize")
        .replace(/unclear|confusing/gi, "Establish clear")
    };

    return findings;
  };

  const categories = displayMode === 'primary' 
    ? [
        { 
          name: 'Sort', 
          score: sortScore, 
          description: 'Organization of materials and removal of unnecessary items'
        },
        { 
          name: 'Set in Order', 
          score: setScore, 
          description: 'Efficient arrangement of necessary items'
        },
        { 
          name: 'Shine', 
          score: shineScore, 
          description: 'Workplace cleanliness and maintenance'
        }
      ]
    : [
        { 
          name: 'Standardize', 
          score: standardizeScore, 
          description: 'Consistent processes and visual management'
        },
        { 
          name: 'Sustain', 
          score: sustainScore, 
          description: 'Long-term maintenance of 5S practices'
        }
      ];

  return (
    <>
      {categories.map(({ name, score, description }) => (
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
            </div>

            {weaknesses
              .filter(w => w.toLowerCase().includes(name.toLowerCase()))
              .slice(0, 2) // Limit to 2 findings per category
              .map((weakness, index) => {
                const finding = formatFinding(weakness, name);
                return (
                  <div key={index} className="bg-slate-50 p-4 rounded-lg space-y-2">
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">Finding {index + 1}:</h5>
                      <p className="text-sm text-gray-700">{finding.finding}</p>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">Impact:</h5>
                      <p className="text-sm text-gray-700">{finding.impact}</p>
                    </div>
                    <div className="space-y-1">
                      <h5 className="font-medium text-sm">Recommended Fix:</h5>
                      <p className="text-sm text-gray-700">{finding.fix}</p>
                    </div>
                  </div>
                );
              })}
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