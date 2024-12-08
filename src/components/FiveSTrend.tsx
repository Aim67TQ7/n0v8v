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
    return data?.map(evaluation => ({
      date: new Date(evaluation.created_at).toLocaleDateString(),
      sort: evaluation.sort_score,
      setInOrder: evaluation.set_in_order_score,
      shine: evaluation.shine_score,
      standardize: evaluation.standardize_score,
      sustain: evaluation.sustain_score,
      average: (
        evaluation.sort_score +
        evaluation.set_in_order_score +
        evaluation.shine_score +
        evaluation.standardize_score +
        evaluation.sustain_score
      ) / 5
    }));
  };

  return (
    <Card className="p-4">
      <h3 className="text-xl font-semibold mb-4">Historical 5S Performance</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={formatData(historicalData || [])}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, 10]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="average" stroke="#2563eb" name="Average Score" />
            <Line type="monotone" dataKey="sort" stroke="#10b981" name="Sort" />
            <Line type="monotone" dataKey="setInOrder" stroke="#f59e0b" name="Set in Order" />
            <Line type="monotone" dataKey="shine" stroke="#ef4444" name="Shine" />
            <Line type="monotone" dataKey="standardize" stroke="#8b5cf6" name="Standardize" />
            <Line type="monotone" dataKey="sustain" stroke="#6366f1" name="Sustain" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};