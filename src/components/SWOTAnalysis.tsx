import { Card } from "@/components/ui/card";

interface SWOTAnalysisProps {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats?: string[]; // Made optional since we won't use it
}

export const SWOTAnalysis = ({ strengths, weaknesses, opportunities }: SWOTAnalysisProps) => {
  const renderList = (items: string[]) => (
    <ul className="list-disc pl-5 space-y-2">
      {items.map((item, index) => (
        <li key={index} className="text-sm">{item}</li>
      ))}
    </ul>
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Card className="p-4 md:col-span-1">
        <h3 className="font-semibold text-green-600 mb-2">Observations & Strengths</h3>
        <p className="text-sm text-gray-600 mb-3">
          Document positive practices: organized workspaces, labeled storage, clean equipment,
          standardized procedures, and sustained improvements.
        </p>
        {renderList(strengths)}
      </Card>
      <Card className="p-4 md:col-span-1">
        <h3 className="font-semibold text-red-600 mb-2">Areas for Improvement</h3>
        <p className="text-sm text-gray-600 mb-3">
          Identify areas that need attention and improvement in the workspace
          organization, cleanliness, and standardization.
        </p>
        {renderList(weaknesses)}
      </Card>
      <Card className="p-4 md:col-span-1">
        <h3 className="font-semibold text-blue-600 mb-2">Improvement Opportunities</h3>
        <p className="text-sm text-gray-600 mb-3">
          Identify potential improvements in sorting, setting in order,
          cleaning procedures, standardization methods, and sustainability practices.
        </p>
        {renderList(opportunities)}
      </Card>
    </div>
  );
};