import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Tooltip } from 'recharts';

interface FiveSScores {
  sort_score: number;
  set_in_order_score: number;
  shine_score: number;
  standardize_score: number;
  sustain_score: number;
}

interface FiveSRadarChartProps {
  scores: FiveSScores;
  canShowAdvancedScores: boolean;
}

export const FiveSRadarChart = ({ scores, canShowAdvancedScores }: FiveSRadarChartProps) => {
  const data = [
    { category: 'Sort', value: scores.sort_score, fullMark: 10 },
    { category: 'Set in Order', value: scores.set_in_order_score, fullMark: 10 },
    { category: 'Shine', value: scores.shine_score, fullMark: 10 },
    { category: 'Standardize', value: canShowAdvancedScores ? scores.standardize_score : 0, fullMark: 10 },
    { category: 'Sustain', value: canShowAdvancedScores ? scores.sustain_score : 0, fullMark: 10 },
  ];

  return (
    <div>
      <ResponsiveContainer width="100%" height={300}>
        <RadarChart data={data} margin={{ top: 20, right: 30, bottom: 20, left: 30 }}>
          <PolarGrid gridType="circle" />
          <PolarAngleAxis dataKey="category" />
          <PolarRadiusAxis domain={[0, 10]} tickCount={6} />
          <Radar
            name="Score"
            dataKey="value"
            stroke="#2563eb"
            fill="#3b82f6"
            fillOpacity={0.6}
          />
          <Tooltip 
            formatter={(value: number) => [`${value.toFixed(1)} / 10`, 'Score']}
            labelFormatter={(label: string) => `${label}`}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};