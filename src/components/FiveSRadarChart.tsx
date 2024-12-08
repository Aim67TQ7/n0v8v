import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Tooltip, Text } from 'recharts';

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

const CustomLabel = ({ x, y, value, cx }: any) => {
  const adjustedX = x > cx ? x + 10 : x - 30;
  return (
    <Text x={adjustedX} y={y} fontSize={12}>
      {value.toFixed(1)}
    </Text>
  );
};

export const FiveSRadarChart = ({ scores }: FiveSRadarChartProps) => {
  const data = [
    { category: 'Sort', value: scores.sort_score, fullMark: 10 },
    { category: 'Set in Order', value: scores.set_in_order_score, fullMark: 10 },
    { category: 'Shine', value: scores.shine_score, fullMark: 10 },
    { category: 'Standardize', value: scores.standardize_score, fullMark: 10 },
    { category: 'Sustain', value: scores.sustain_score, fullMark: 10 },
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
          label={<CustomLabel />}
        />
        <Tooltip />
      </RadarChart>
    </ResponsiveContainer>
  );
};