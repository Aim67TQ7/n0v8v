import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

interface ChecklistItem {
  item: string;
  score: number;
  description: string;
}

interface DetailedReport {
  sort_checklist: ChecklistItem[];
  sort_positive_observations: string[];
  sort_concerns: string[];
  set_checklist: ChecklistItem[];
  set_positive_observations: string[];
  set_concerns: string[];
  shine_checklist: ChecklistItem[];
  shine_positive_observations: string[];
  shine_concerns: string[];
  follow_up_actions: string[];
  recommendations: string[];
}

interface FiveSDetailedReportProps {
  evaluationId: string;
}

export const FiveSDetailedReport = ({ evaluationId }: FiveSDetailedReportProps) => {
  const [report, setReport] = useState<DetailedReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      const { data, error } = await supabase
        .from('five_s_detailed_reports')
        .select('*')
        .eq('evaluation_id', evaluationId)
        .single();

      if (error) {
        console.error('Error fetching report:', error);
        return;
      }

      // Parse the JSON fields to ensure they match our expected types
      const parsedReport: DetailedReport = {
        sort_checklist: Array.isArray(data.sort_checklist) ? data.sort_checklist : [],
        sort_positive_observations: data.sort_positive_observations || [],
        sort_concerns: data.sort_concerns || [],
        set_checklist: Array.isArray(data.set_checklist) ? data.set_checklist : [],
        set_positive_observations: data.set_positive_observations || [],
        set_concerns: data.set_concerns || [],
        shine_checklist: Array.isArray(data.shine_checklist) ? data.shine_checklist : [],
        shine_positive_observations: data.shine_positive_observations || [],
        shine_concerns: data.shine_concerns || [],
        follow_up_actions: data.follow_up_actions || [],
        recommendations: data.recommendations || []
      };

      setReport(parsedReport);
      setIsLoading(false);
    };

    fetchReport();
  }, [evaluationId]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!report) return null;

  const renderChecklist = (checklist: ChecklistItem[], title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title} Checklist</h3>
      <div className="space-y-2">
        {checklist.map((item, index) => (
          <div key={index} className="flex justify-between items-start border-b pb-2">
            <div className="flex-1">
              <p className="font-medium">{item.item}</p>
              <p className="text-sm text-gray-600">{item.description}</p>
            </div>
            <span className={`px-2 py-1 rounded text-sm ${
              item.score === 1 ? 'bg-green-100 text-green-800' :
              item.score === 0.5 ? 'bg-yellow-100 text-yellow-800' :
              'bg-red-100 text-red-800'
            }`}>
              {item.score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderObservations = (positives: string[], concerns: string[], title: string) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold">{title} Observations</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-4 bg-green-50">
          <h4 className="font-medium text-green-800 mb-2">Positive Notes</h4>
          <ul className="list-disc pl-4 space-y-1">
            {positives.map((item, index) => (
              <li key={index} className="text-sm text-green-700">{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-4 bg-yellow-50">
          <h4 className="font-medium text-yellow-800 mb-2">Areas of Concern</h4>
          <ul className="list-disc pl-4 space-y-1">
            {concerns.map((item, index) => (
              <li key={index} className="text-sm text-yellow-700">{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {renderChecklist(report.sort_checklist, 'Sort')}
      {renderObservations(report.sort_positive_observations, report.sort_concerns, 'Sort')}
      
      {renderChecklist(report.set_checklist, 'Set in Order')}
      {renderObservations(report.set_positive_observations, report.set_concerns, 'Set in Order')}
      
      {renderChecklist(report.shine_checklist, 'Shine')}
      {renderObservations(report.shine_positive_observations, report.shine_concerns, 'Shine')}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Action Items</h3>
        <Card className="p-4">
          <h4 className="font-medium mb-2">Recommendations</h4>
          <ul className="list-disc pl-4 space-y-1">
            {report.recommendations.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        </Card>
        <Card className="p-4">
          <h4 className="font-medium mb-2">Follow-up Actions</h4>
          <ul className="list-disc pl-4 space-y-1">
            {report.follow_up_actions.map((item, index) => (
              <li key={index} className="text-sm">{item}</li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
};