import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { 
  FiveSDetailedReport as DetailedReportType,
  parseChecklistData 
} from "@/types/five-s";

interface FiveSDetailedReportProps {
  evaluationId: string;
}

export const FiveSDetailedReport = ({ evaluationId }: FiveSDetailedReportProps) => {
  const { data: detailedReport, isLoading } = useQuery({
    queryKey: ['detailed-report', evaluationId],
    queryFn: async () => {
      console.log('Fetching detailed report for evaluation:', evaluationId);
      
      const { data, error } = await supabase
        .from('five_s_detailed_reports')
        .select('*')
        .eq('evaluation_id', evaluationId)
        .single();

      if (error) {
        console.error('Error fetching detailed report:', error);
        throw error;
      }

      // Parse the JSON data into strongly typed arrays
      const parsedData: DetailedReportType = {
        ...data,
        sort_checklist: parseChecklistData(data.sort_checklist),
        set_checklist: parseChecklistData(data.set_checklist),
        shine_checklist: parseChecklistData(data.shine_checklist),
        sort_positive_observations: Array.isArray(data.sort_positive_observations) ? data.sort_positive_observations : [],
        sort_concerns: Array.isArray(data.sort_concerns) ? data.sort_concerns : [],
        set_positive_observations: Array.isArray(data.set_positive_observations) ? data.set_positive_observations : [],
        set_concerns: Array.isArray(data.set_concerns) ? data.set_concerns : [],
        shine_positive_observations: Array.isArray(data.shine_positive_observations) ? data.shine_positive_observations : [],
        shine_concerns: Array.isArray(data.shine_concerns) ? data.shine_concerns : [],
        follow_up_actions: Array.isArray(data.follow_up_actions) ? data.follow_up_actions : [],
        recommendations: Array.isArray(data.recommendations) ? data.recommendations : [],
      };

      console.log('Parsed detailed report data:', parsedData);
      return parsedData;
    }
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!detailedReport) {
    console.log('No detailed report found for evaluation:', evaluationId);
    return (
      <Card className="p-6 mt-8">
        <p className="text-center text-muted-foreground">
          No detailed report found for this evaluation
        </p>
      </Card>
    );
  }

  // Log the structure of the report data
  console.log('Detailed report structure:', {
    hasSort: !!detailedReport.sort_checklist,
    sortChecklistLength: detailedReport.sort_checklist?.length,
    hasSet: !!detailedReport.set_checklist,
    setChecklistLength: detailedReport.set_checklist?.length,
    hasShine: !!detailedReport.shine_checklist,
    shineChecklistLength: detailedReport.shine_checklist?.length,
    hasFollowUp: !!detailedReport.follow_up_actions,
    followUpLength: detailedReport.follow_up_actions?.length,
    hasRecommendations: !!detailedReport.recommendations,
    recommendationsLength: detailedReport.recommendations?.length,
  });

  return (
    <Card className="p-6 mt-8">
      <div className="space-y-8">
        {/* Sort Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Sort (整理)</h3>
          
          {detailedReport.sort_checklist?.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Checklist</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.sort_checklist.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item.item} - Score: {item.score}/10
                    {item.description && (
                      <p className="text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detailedReport.sort_positive_observations?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Positive Observations</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.sort_positive_observations.map((obs, index) => (
                  <li key={index} className="text-sm">{obs}</li>
                ))}
              </ul>
            </div>
          )}

          {detailedReport.sort_concerns?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Areas of Concern</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.sort_concerns.map((concern, index) => (
                  <li key={index} className="text-sm">{concern}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Set in Order Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Set in Order (整頓)</h3>
          
          {detailedReport.set_checklist?.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Checklist</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.set_checklist.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item.item} - Score: {item.score}/10
                    {item.description && (
                      <p className="text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detailedReport.set_positive_observations?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Positive Observations</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.set_positive_observations.map((obs, index) => (
                  <li key={index} className="text-sm">{obs}</li>
                ))}
              </ul>
            </div>
          )}

          {detailedReport.set_concerns?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Areas of Concern</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.set_concerns.map((concern, index) => (
                  <li key={index} className="text-sm">{concern}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Shine Section */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Shine (清掃)</h3>
          
          {detailedReport.shine_checklist?.length > 0 && (
            <div className="space-y-4">
              <h4 className="font-medium">Checklist</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.shine_checklist.map((item, index) => (
                  <li key={index} className="text-sm">
                    {item.item} - Score: {item.score}/10
                    {item.description && (
                      <p className="text-muted-foreground mt-1">{item.description}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {detailedReport.shine_positive_observations?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Positive Observations</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.shine_positive_observations.map((obs, index) => (
                  <li key={index} className="text-sm">{obs}</li>
                ))}
              </ul>
            </div>
          )}

          {detailedReport.shine_concerns?.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium">Areas of Concern</h4>
              <ul className="list-disc pl-5 space-y-2">
                {detailedReport.shine_concerns.map((concern, index) => (
                  <li key={index} className="text-sm">{concern}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Follow-up Actions */}
        {detailedReport.follow_up_actions?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-4">Follow-up Actions</h3>
            <ul className="list-disc pl-5 space-y-2">
              {detailedReport.follow_up_actions.map((action, index) => (
                <li key={index} className="text-sm">{action}</li>
              ))}
            </ul>
          </section>
        )}

        {/* Recommendations */}
        {detailedReport.recommendations?.length > 0 && (
          <section>
            <h3 className="text-lg font-semibold mb-4">Recommendations</h3>
            <ul className="list-disc pl-5 space-y-2">
              {detailedReport.recommendations.map((rec, index) => (
                <li key={index} className="text-sm">{rec}</li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </Card>
  );
};