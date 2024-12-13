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
  const getDetailedAnalysis = (score: number | undefined, category: string) => {
    if (score === undefined) return "";
    
    const categoryWeaknesses = weaknesses.filter(w => 
      w.toLowerCase().includes(category.toLowerCase())
    );

    const getScoreDescription = (score: number) => {
      if (score <= 3) return "Critical issues requiring immediate attention";
      if (score <= 5) return "Significant issues impacting operations";
      if (score <= 7) return "Moderate issues affecting efficiency";
      return "Minor improvements needed";
    };

    const getImpactLevel = (score: number) => {
      if (score <= 3) return "high";
      if (score <= 5) return "significant";
      if (score <= 7) return "moderate";
      return "minor";
    };

    return (
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h4 className="font-medium text-lg">{category}</h4>
          <span className={`px-2 py-1 rounded text-sm ${
            score <= 3 ? 'bg-red-100 text-red-800' :
            score <= 5 ? 'bg-orange-100 text-orange-800' :
            score <= 7 ? 'bg-yellow-100 text-yellow-800' :
            'bg-green-100 text-green-800'
          }`}>
            Score: {score}/10 - {getScoreDescription(score)}
          </span>
        </div>
        
        {categoryWeaknesses.length > 0 && (
          <>
            <h5 className="font-medium text-sm mb-2">Specific Findings:</h5>
            <ul className="list-disc pl-5 space-y-2 mb-4">
              {categoryWeaknesses.map((weakness, index) => (
                <li key={index} className="text-sm text-gray-700">{weakness}</li>
              ))}
            </ul>
          </>
        )}
        
        <div className="text-sm text-gray-700">
          <p className="mb-2">
            This area shows {getImpactLevel(score)} impact on overall operational efficiency.
            {score <= 7 && " Immediate attention and corrective actions are recommended."}
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4">Detailed 5S Analysis</h3>
      
      {getDetailedAnalysis(sortScore, "Sort")}
      {getDetailedAnalysis(setScore, "Set in Order")}
      {getDetailedAnalysis(shineScore, "Shine")}
      {getDetailedAnalysis(standardizeScore, "Standardize")}
      {getDetailedAnalysis(sustainScore, "Sustain")}
    </Card>
  );
};