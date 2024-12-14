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
        return [
          "Current State: Excessive items and unclear inventory controls increase material retrieval times by 15-30%",
          "Recommendation: Implement systematic sorting system and weekly inventory audits to optimize workspace organization"
        ];
      case 'Set in Order':
        return [
          "Current State: Suboptimal tool placement increases motion waste by 25% and impacts daily workflow efficiency",
          "Recommendation: Create visual management system with tools arranged by frequency of use within arm's reach"
        ];
      case 'Shine':
        return [
          "Current State: Inconsistent cleaning leads to 20% increased equipment downtime and reduced asset lifetime",
          "Recommendation: Establish daily cleaning schedules with visual inspection checklists for each work area"
        ];
      case 'Standardize':
        return [
          "Current State: Process variations between shifts result in 30% inconsistency in 5S practice application",
          "Recommendation: Develop clear SOPs with visual guides and implement regular cross-shift audits"
        ];
      case 'Sustain':
        return [
          "Current State: Limited long-term adherence reduces employee participation by 40% in workplace organization",
          "Recommendation: Implement monthly recognition program and visual management boards to track improvements"
        ];
      default:
        return [];
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
              <ul className="space-y-2">
                {getCategoryAnalysis(name).map((point, index) => (
                  <li key={index} className="text-sm text-gray-700 leading-relaxed">
                    • {point}
                  </li>
                ))}
              </ul>
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