import { Card } from "@/components/ui/card";

interface DetailedFiveSAnalysisProps {
  sortScore?: number;
  setScore?: number;
  shineScore?: number;
  standardizeScore?: number;
  sustainScore?: number;
  weaknesses: string[];
}

export const DetailedFiveSAnalysis = ({
  sortScore,
  setScore,
  shineScore,
  standardizeScore,
  sustainScore,
  weaknesses
}: DetailedFiveSAnalysisProps) => {
  const getScoreClass = (score: number) => {
    if (score <= 3) return 'bg-red-100 text-red-800';
    if (score <= 5) return 'bg-orange-100 text-orange-800';
    if (score <= 7) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const renderCategoryAnalysis = (score: number | undefined, category: string) => {
    if (score === undefined) return null;

    // Calculate total score of first 3 categories
    const baseScore = (sortScore || 0) + (setScore || 0) + (shineScore || 0);
    
    // Don't show Standardize and Sustain if base score is less than 20
    if (baseScore < 20 && (category === "Standardize" || category === "Sustain")) {
      return null;
    }

    const categoryWeaknesses = weaknesses.filter(w => 
      w.toLowerCase().includes(category.toLowerCase())
    );

    return (
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-lg">{category}</h4>
          <span className={`px-3 py-1 rounded-full text-sm ${getScoreClass(score)}`}>
            Score: {score}/10
          </span>
        </div>

        <div className="space-y-4">
          {categoryWeaknesses.length > 0 && (
            <div>
              <h5 className="font-medium text-sm mb-2">Specific Findings:</h5>
              <ul className="list-disc pl-5 space-y-3">
                {categoryWeaknesses.map((weakness, index) => (
                  <li key={index} className="text-gray-700">
                    {weakness}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  };

  // Calculate total score of first 3 categories
  const baseScore = (sortScore || 0) + (setScore || 0) + (shineScore || 0);

  return (
    <Card className="p-6">
      <h3 className="text-xl font-semibold mb-6">Detailed 5S Analysis</h3>
      
      {renderCategoryAnalysis(sortScore, "Sort")}
      {renderCategoryAnalysis(setScore, "Set in Order")}
      {renderCategoryAnalysis(shineScore, "Shine")}
      {renderCategoryAnalysis(standardizeScore, "Standardize")}
      {renderCategoryAnalysis(sustainScore, "Sustain")}

      {baseScore < 20 && (
        <div className="mt-6 bg-blue-50 p-4 rounded-md">
          <h4 className="font-medium text-blue-800 mb-2">Standardize and Sustain Locked</h4>
          <p className="text-sm text-blue-700">
            Sort, Set in Order, and Shine must achieve a combined score of 20 points before Standardize and Sustain evaluations become available.
            Current combined score: {baseScore}/30
          </p>
        </div>
      )}

      {(sortScore <= 5 || setScore <= 5 || shineScore <= 5) && (
        <div className="mt-6 bg-red-50 p-4 rounded-md">
          <h4 className="font-medium text-red-800 mb-2">Priority Action Required</h4>
          <p className="text-sm text-red-700">
            Multiple areas require immediate attention. Focus first on addressing the lowest-scoring categories
            to establish a foundation for sustainable 5S implementation.
          </p>
        </div>
      )}
    </Card>
  );
};