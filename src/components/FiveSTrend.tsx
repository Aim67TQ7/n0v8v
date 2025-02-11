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
      const totalScore = (
        (evaluation.sort_score || 0) +
        (evaluation.set_in_order_score || 0) +
        (evaluation.shine_score || 0) +
        (evaluation.standardize_score || 0) +
        (evaluation.sustain_score || 0)
      );
      
      const scorePercentage = (totalScore / 50) * 100;

      return {
        date: new Date(evaluation.created_at).toLocaleDateString(),
        scorePercentage: Number(scorePercentage.toFixed(1))
      };
    });
  };

  return (
    <div className="h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={formatData(historicalData || [])} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis domain={[0, 100]} label={{ value: 'Overall Score %', angle: -90, position: 'insideLeft' }} />
          <Tooltip />
          <Legend />
          <Line
            type="monotone"
            dataKey="scorePercentage"
            name="Overall Score %"
            stroke="#000000"
            strokeWidth={2}
            dot={{ fill: '#000000' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};