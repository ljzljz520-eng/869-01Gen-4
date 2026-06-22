import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';
import type { TrendPoint, MetricType } from '@/types';
import { METRIC_LABELS, METRIC_UNITS } from '@/types';

interface TrendChartProps {
  data: TrendPoint[];
  metric: MetricType;
  title?: string;
  height?: number;
  color?: string;
  gradientId?: string;
}

export default function TrendChart({
  data,
  metric,
  title,
  height = 280,
  color = '#10B981',
  gradientId = 'colorGradient',
}: TrendChartProps) {
  const label = METRIC_LABELS[metric] || metric;
  const unit = METRIC_UNITS[metric] || '';
  const [hoveredPoint, setHoveredPoint] = useState<TrendPoint | null>(null);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      return (
        <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-3 border border-gray-100">
          <p className="text-xs text-gray-500 mb-1">{point.date}</p>
          <p className="text-lg font-bold text-gray-900">
            {payload[0].value}
            <span className="text-sm font-normal text-gray-500 ml-1">{unit}</span>
          </p>
          <p className="text-xs text-gray-400 mt-1">{label}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="card p-6">
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 text-lg">{title}</h3>
          {hoveredPoint && (
            <div className="text-sm text-gray-500">
              {hoveredPoint.value} {unit}
            </div>
          )}
        </div>
      )}

      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
            onMouseMove={(e: any) => {
              if (e && e.activePayload) {
                setHoveredPoint(e.activePayload[0].payload);
              }
            }}
            onMouseLeave={() => setHoveredPoint(null)}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.25} />
                <stop offset="95%" stopColor={color} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={{ stroke: '#f0f0f0' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 12, fill: '#9ca3af' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `${value}${unit}`}
              width={50}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: color, strokeDasharray: '4 4' }} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2.5}
              fill={`url(#${gradientId})`}
              dot={false}
              activeDot={{ r: 6, fill: color, stroke: '#fff', strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
