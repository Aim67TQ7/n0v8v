import { Card } from "@/components/ui/card";

interface SWOTAnalysisProps {
  strengths: string[];
  weaknesses: string[];
  sortScore?: number;
  setScore?: number;
}

export const SWOTAnalysis = ({ strengths, weaknesses, sortScore, setScore }: SWOTAnalysisProps) => {
  const renderList = (items: string[]) => (
    <ul className="list-disc pl-5 space-y-4">
      {items.map((item, index) => (
        <li key={index} className="text-sm">{item}</li>
      ))}
    </ul>
  );

  // Filter weaknesses based on scores
  const shouldShowAllWeaknesses = (sortScore === undefined || setScore === undefined) || 
    (sortScore >= 8 && setScore >= 8);
  
  const filteredWeaknesses = shouldShowAllWeaknesses ? weaknesses : 
    weaknesses.filter(weakness => 
      (sortScore < 8 && weakness.toLowerCase().includes('sort')) || 
      (setScore < 8 && weakness.toLowerCase().includes('set in order'))
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="font-semibold text-green-600 mb-2">Observations & Strengths</h3>
        <p className="text-sm text-gray-600 mb-3">
          Document positive practices: organized workspaces, labeled storage, clean equipment,
          standardized procedures, and sustained improvements.
        </p>
        {renderList(strengths)}
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold text-red-600 mb-2">Areas for Improvement</h3>
        <p className="text-sm text-gray-600 mb-3">
          Each finding below identifies a specific issue across the workcenter,
          its impact on operations, and provides a clear solution with expected benefits.
        </p>
        {renderList(filteredWeaknesses)}
      </Card>
    </div>
  );
};