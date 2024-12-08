import { Card } from "@/components/ui/card";

interface SWOTAnalysisProps {
  strengths: string[];
  opportunities: string[];
}

export const SWOTAnalysis = ({ strengths, opportunities }: SWOTAnalysisProps) => {
  const renderList = (items: string[]) => (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-sm">{item}</li>
      ))}
    </ul>
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
        <h3 className="font-semibold text-blue-600 mb-2">Opportunities for Improvement</h3>
        <p className="text-sm text-gray-600 mb-3">
          For each opportunity, we identify the specific issue, its impact on operations,
          and provide clear, actionable solutions with expected benefits.
        </p>
        {renderList(opportunities)}
      </Card>
    </div>
  );
};