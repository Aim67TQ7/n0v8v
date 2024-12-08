import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';

interface FiveSScores {
  sort_score: number;
  set_in_order_score: number;
  shine_score: number;
  standardize_score: number;
  sustain_score: number;
}

interface FiveSRadarChartProps {
  scores: FiveSScores;
}

export const FiveSRadarChart = ({ scores }: FiveSRadarChartProps) => {
  const data = [
    { category: 'Sort', value: scores.sort_score },
    { category: 'Set in Order', value: scores.set_in_order_score },
    { category: 'Shine', value: scores.shine_score },
    { category: 'Standardize', value: scores.standardize_score },
    { category: 'Sustain', value: scores.sustain_score },
  ];

  return (
    <ResponsiveContainer width="100%" height={300}>
      <RadarChart data={data}>
        <PolarGrid />
        <PolarAngleAxis dataKey="category" />
        <Radar
          name="Score"
          dataKey="value"
          stroke="#2563eb"
          fill="#3b82f6"
          fillOpacity={0.6}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
};