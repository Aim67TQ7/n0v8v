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
        return "The current workspace shows excessive items and unclear inventory controls, resulting in 15-30% increased material retrieval times. To address this, implementing a systematic sorting system combined with weekly inventory audits will optimize workspace organization and significantly reduce time waste.";
      case 'Set in Order':
        return "Suboptimal tool placement is currently causing a 25% increase in motion waste and negatively impacting daily workflow efficiency. Creating a visual management system with tools arranged by frequency of use within arm's reach will streamline operations and enhance productivity.";
      case 'Shine':
        return "Inconsistent cleaning practices have led to a 20% increase in equipment downtime and reduced asset lifetime. Establishing daily cleaning schedules with visual inspection checklists for each work area will improve equipment reliability and maintain optimal working conditions.";
      case 'Standardize':
        return "Current process variations between shifts have resulted in 30% inconsistency in 5S practice application. Developing clear SOPs with visual guides and implementing regular cross-shift audits will ensure uniform practices and improve overall operational consistency.";
      case 'Sustain':
        return "Limited long-term adherence to 5S practices has reduced employee participation by 40% in workplace organization initiatives. Implementing a monthly recognition program alongside visual management boards will help track improvements and maintain sustained engagement in 5S practices.";
      default:
        return "";
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

            <div className="mt-4">
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