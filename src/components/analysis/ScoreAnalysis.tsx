import { Card } from "@/components/ui/card";

interface ScoreAnalysisProps {
  sortScore?: number;
  setScore?: number;
  shineScore?: number;
  weaknesses: string[];
}

export const ScoreAnalysis = ({ 
  sortScore, 
  setScore, 
  shineScore,
  weaknesses 
}: ScoreAnalysisProps) => {
  const formatImprovementSuggestion = (weakness: string, category: string) => {
    // Convert weakness into a more detailed, action-oriented format
    const impact = category === 'Sort' 
      ? 'reducing workspace efficiency and increasing search time'
      : category === 'Set in Order'
      ? 'causing delays in tool retrieval and workflow disruptions'
      : 'potentially affecting product quality and workplace safety';

    const suggestion = weakness
      .replace(/missing|lack of|no |poor/gi, "implement")
      .replace(/disorganized|messy/gi, "organize")
      .replace(/unclear|confusing/gi, "establish clear");

    return `${weakness}. This is ${impact}. To improve: ${suggestion.toLowerCase()} to enhance workplace organization.`;
  };

  return (
    <Card className="p-4">
      <h3 className="font-semibold text-primary mb-2">5S Score Analysis</h3>
      
      <div className="space-y-6">
        {[
          { name: 'Sort', score: sortScore },
          { name: 'Set in Order', score: setScore },
          { name: 'Shine', score: shineScore }
        ].map(({ name, score }) => {
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
      </div>
    </Card>
  );
};