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
      // Calculate total score
      const totalScore = (
        (evaluation.sort_score || 0) +
        (evaluation.set_in_order_score || 0) +
        (evaluation.shine_score || 0) +
        (evaluation.standardize_score || 0) +
        (evaluation.sustain_score || 0)
      );
      
      // Calculate percentage
      const scorePercentage = (totalScore / 50) * 100;

      return {
        date: new Date(evaluation.created_at).toLocaleDateString(),
        totalScore: Number(scorePercentage.toFixed(1)),
        sort: evaluation.sort_score || 0,
        setInOrder: evaluation.set_in_order_score || 0,
        shine: evaluation.shine_score || 0,
        standardize: evaluation.standardize_score || 0,
        sustain: evaluation.sustain_score || 0
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
            <YAxis domain={[0, 100]} label={{ value: 'Score', angle: -90, position: 'insideLeft' }} />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="totalScore"
              name="Total Score %"
              stroke="#000000"
              strokeWidth={2}
              dot={{ fill: '#000000' }}
            />
            <Line type="monotone" dataKey="sort" name="Sort" stroke="#2563eb" />
            <Line type="monotone" dataKey="setInOrder" name="Set in Order" stroke="#16a34a" />
            <Line type="monotone" dataKey="shine" name="Shine" stroke="#dc2626" />
            <Line type="monotone" dataKey="standardize" name="Standardize" stroke="#9333ea" />
            <Line type="monotone" dataKey="sustain" name="Sustain" stroke="#ea580c" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};