import { Card } from "@/components/ui/card";

interface SWOTAnalysisProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export const SWOTAnalysis = ({ strengths, weaknesses, opportunities, threats }: SWOTAnalysisProps) => {
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
        {renderList(strengths)}
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold text-red-600 mb-2">Findings & Areas of Concern</h3>
        {renderList(weaknesses)}
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold text-blue-600 mb-2">Improvement Opportunities</h3>
        {renderList(opportunities)}
      </Card>
      <Card className="p-4">
        <h3 className="font-semibold text-orange-600 mb-2">Specific Action Items</h3>
        {renderList(threats)}
      </Card>
    </div>
  );
};