import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";
import { 
  FiveSDetailedReport as DetailedReportType,
  parseChecklistData 
} from "@/types/five-s";
import { FiveSSection } from "./five-s/FiveSSection";
import { FiveSFollowUp } from "./five-s/FiveSFollowUp";

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
        set_positive_observations: Array.isArray(data.set_positive_observations) ? data.set_positive_observations : [],
        shine_positive_observations: Array.isArray(data.shine_positive_observations) ? data.shine_positive_observations : [],
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
    return (
      <Card className="p-6 mt-8">
        <p className="text-center text-muted-foreground">
          No detailed report found for this evaluation
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 mt-8">
      <div className="space-y-8">
        <FiveSSection
          title="Sort"
          japaneseTitle="整理"
          checklist={detailedReport.sort_checklist}
          positiveObservations={detailedReport.sort_positive_observations}
        />

        <FiveSSection
          title="Set in Order"
          japaneseTitle="整頓"
          checklist={detailedReport.set_checklist}
          positiveObservations={detailedReport.set_positive_observations}
        />

        <FiveSSection
          title="Shine"
          japaneseTitle="清掃"
          checklist={detailedReport.shine_checklist}
          positiveObservations={detailedReport.shine_positive_observations}
        />

        <FiveSFollowUp
          followUpActions={detailedReport.follow_up_actions}
          recommendations={detailedReport.recommendations}
        />
      </div>
    </Card>
  );
};