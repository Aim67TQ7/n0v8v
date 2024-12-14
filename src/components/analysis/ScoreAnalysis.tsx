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

  const getCategoryAnalysis = (category: string) => {
    switch (category) {
      case 'Sort':
        return 'In the current workspace, there are opportunities to enhance organization through systematic sorting. Removing unnecessary items and establishing clear inventory controls will directly improve material retrieval times and reduce motion waste. This optimization can lead to a 15-30% reduction in time spent searching for tools and materials.';
      case 'Set in Order':
        return 'The workspace layout shows potential for improved arrangement of frequently used items. By implementing visual management systems and optimizing tool placement based on usage frequency, we can minimize unnecessary movement and streamline daily operations. Strategic placement can reduce motion waste by up to 25% and improve overall workflow efficiency.';
      case 'Shine':
        return 'Regular cleaning and maintenance procedures need strengthening in key areas of the workspace. Implementing daily cleaning schedules and preventive maintenance checks will help identify potential equipment issues early and maintain optimal working conditions. This proactive approach can reduce equipment downtime by up to 20% and extend asset lifetime.';
      case 'Standardize':
        return 'Current processes show variation in how 5S practices are maintained across different shifts and operators. Developing and documenting clear standard operating procedures, combined with visual controls, will ensure consistent application of 5S principles. Standardization typically results in a 30% reduction in process variation and improved quality outcomes.';
      case 'Sustain':
        return 'Long-term adherence to 5S practices requires strengthening through systematic audits and employee engagement. Implementing regular audits, recognition programs, and continuous improvement initiatives will help embed 5S practices into daily routines. This cultural shift typically leads to sustained improvements and a 40% increase in employee participation in workplace organization initiatives.';
      default:
        return '';
    }
  };

  const formatImprovementSuggestion = (weakness: string, category: string) => {
    const cleanWeakness = weakness.replace(new RegExp(`^${category}:\\s*`, 'i'), '').toLowerCase();
    
    return `Based on the current workspace condition, ${cleanWeakness}. Addressing this will improve operational efficiency and workplace organization.`;
  };

  const categories = displayMode === 'primary' 
    ? [
        { name: 'Sort', score: sortScore },
        { name: 'Set in Order', score: setScore },
        { name: 'Shine', score: shineScore }
      ]
    : [
        { name: 'Standardize', score: standardizeScore },
        { name: 'Sustain', score: sustainScore }
      ];

  return (
    <>
      {categories.map(({ name, score }) => (
        <Card key={name} className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-medium text-lg">{name}</h4>
            <span className={`px-3 py-1 rounded-full text-sm ${getScoreClass(score || 0)}`}>
              Score: {score}/10
            </span>
          </div>

          <div className="space-y-4">
            {weaknesses
              .filter(w => w.toLowerCase().includes(name.toLowerCase()))
              .length > 0 && (
              <div>
                <h5 className="font-medium text-sm mb-2">Specific Findings:</h5>
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

            <div>
              <p className="text-sm text-gray-700 leading-relaxed">
                {getCategoryAnalysis(name)}
              </p>
            </div>
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