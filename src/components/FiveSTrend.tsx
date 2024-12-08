import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FiveSTrendProps {
  workcenterId: string;
}

export const FiveSTrend = ({ workcenterId }: FiveSTrendProps) => {
  const { data: historicalData, isLoading } = useQuery({
    queryKey: ['fiveSTrend', workcenterId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('five_s_evaluations')
        .select('*')
        .eq('workcenter_id', workcenterId)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data;
    }
  });

  if (isLoading) return <div>Loading trend data...</div>;

  const formatData = (data: any[]) => {
    return data?.map(evaluation => {
      const baseScore = (
        evaluation.sort_score +
        evaluation.set_in_order_score +
        evaluation.shine_score +
        evaluation.standardize_score +
        evaluation.sustain_score
      );
      
      const finalScore = Math.max(0, baseScore + (evaluation.safety_deduction || 0));
      const scorePercentage = (finalScore / 50) * 100;
      const concernCount = evaluation.weaknesses?.length || 0;

      return {
        date: new Date(evaluation.created_at).toLocaleDateString(),
        scorePercentage: Number(scorePercentage.toFixed(1)),
        concernCount
      };
    });
  };

  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4">Historical 5S Performance</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatData(historicalData || [])} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis yAxisId="left" domain={[0, 100]} label={{ value: 'Score %', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" domain={[0, 'auto']} label={{ value: 'Number of Concerns', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Legend />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="scorePercentage"
              name="Score %"
              stroke="#000000"
              strokeWidth={2}
              dot={{ fill: '#000000' }}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="concernCount"
              name="Number of Concerns"
              stroke="#666666"
              strokeDasharray="5 5"
              dot={{ fill: '#666666' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};