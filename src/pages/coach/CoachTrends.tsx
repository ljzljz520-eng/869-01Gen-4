import { useState } from 'react';
import AppLayout from '@/components/AppLayout';
import TrendChart from '@/components/TrendChart';
import { useAppStore } from '@/store/useAppStore';
import type { MetricType } from '@/types';

const metricGroups = [
  {
    title: '身体成分',
    metrics: [
      { key: 'weight' as MetricType, label: '体重' },
      { key: 'bodyFatRate' as MetricType, label: '体脂率' },
      { key: 'bmi' as MetricType, label: 'BMI' },
    ],
  },
  {
    title: '围度数据',
    metrics: [
      { key: 'waist' as MetricType, label: '腰围' },
      { key: 'hip' as MetricType, label: '臀围' },
      { key: 'chest' as MetricType, label: '胸围' },
      { key: 'arm' as MetricType, label: '臂围' },
      { key: 'thigh' as MetricType, label: '大腿围' },
    ],
  },
  {
    title: '力量测试',
    metrics: [
      { key: 'benchPress' as MetricType, label: '卧推' },
      { key: 'squat' as MetricType, label: '深蹲' },
      { key: 'deadlift' as MetricType, label: '硬拉' },
    ],
  },
];

export default function CoachTrends() {
  const members = useAppStore((state) => state.members);
  const [selectedMember, setSelectedMember] = useState(members[0]?.id || '');

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">趋势分析</h1>
            <p className="text-gray-500">多维度查看会员身体数据变化趋势</p>
          </div>
          <div>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="input min-w-[200px]"
            >
              {members.map((m) => (
                <option key={m.id} value={m.id}>
                  {m.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {metricGroups.map((group, groupIndex) => (
          <div key={group.title} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.metrics.map((metric, index) => {
                const trendData = selectedMember
                  ? useAppStore.getState().getTrendData(selectedMember, metric.key)
                  : [];
                const colors = ['#10B981', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899'];
                const colorIndex = (groupIndex * 3 + index) % colors.length;

                return (
                  <TrendChart
                    key={metric.key}
                    data={trendData}
                    metric={metric.key}
                    title={metric.label}
                    height={240}
                    color={colors[colorIndex]}
                    gradientId={`gradient-${metric.key}`}
                  />
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}
