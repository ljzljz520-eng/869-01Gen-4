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

const colors = ['#10B981', '#0EA5E9', '#F59E0B', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

export default function MemberTrends() {
  const currentMemberId = useAppStore((state) => state.currentMemberId);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">体测趋势</h1>
          <p className="text-gray-500">查看各维度数据的历史变化趋势</p>
        </div>

        {metricGroups.map((group, groupIndex) => (
          <div key={group.title} className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">{group.title}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {group.metrics.map((metric, metricIndex) => {
                const trendData = currentMemberId
                  ? useAppStore.getState().getTrendData(currentMemberId, metric.key)
                  : [];
                const colorIndex = (groupIndex * 3 + metricIndex) % colors.length;

                return (
                  <TrendChart
                    key={metric.key}
                    data={trendData}
                    metric={metric.key}
                    title={metric.label}
                    height={240}
                    color={colors[colorIndex]}
                    gradientId={`member-${metric.key}`}
                  />
                );
              })}
            </div>
          </div>
        ))}

        <div className="card p-6 mt-8 bg-gradient-to-r from-primary-50 to-secondary-50">
          <p className="text-sm text-gray-600 text-center">
            💡 数据趋势仅供参考，如有健康问题请咨询专业医生
          </p>
        </div>
      </div>
    </AppLayout>
  );
}
