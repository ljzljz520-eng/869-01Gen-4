import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Scale,
  Percent,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Info,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/StatCard';
import TrendChart from '@/components/TrendChart';
import { useAppStore } from '@/store/useAppStore';
import type { MetricType } from '@/types';
import { METRIC_LABELS } from '@/types';

export default function MemberDashboard() {
  const navigate = useNavigate();
  const currentUser = useAppStore((state) => state.currentUser);
  const currentMemberId = useAppStore((state) => state.currentMemberId);
  const getLatestMeasurement = useAppStore((state) => state.getLatestMeasurement);
  const getMemberMeasurements = useAppStore((state) => state.getMemberMeasurements);
  const getMemberGoals = useAppStore((state) => state.getMemberGoals);
  const getHealthAlerts = useAppStore((state) => state.getHealthAlerts);

  const [animatedWeight, setAnimatedWeight] = useState(0);
  const [animatedBodyFat, setAnimatedBodyFat] = useState(0);
  const [animatedBmi, setAnimatedBmi] = useState(0);

  const latest = currentMemberId ? getLatestMeasurement(currentMemberId) : null;
  const measurements = currentMemberId ? getMemberMeasurements(currentMemberId) : [];
  const goals = currentMemberId ? getMemberGoals(currentMemberId) : [];
  const alerts = getHealthAlerts();

  const firstMeasurement = measurements[0];
  const weightChange = latest?.weight && firstMeasurement?.weight
    ? ((latest.weight - firstMeasurement.weight) / firstMeasurement.weight) * 100
    : 0;
  const bodyFatChange = latest?.bodyFatRate && firstMeasurement?.bodyFatRate
    ? ((latest.bodyFatRate - firstMeasurement.bodyFatRate) / firstMeasurement.bodyFatRate) * 100
    : 0;

  useEffect(() => {
    if (latest?.weight) {
      const duration = 1000;
      const steps = 30;
      const stepDuration = duration / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeProgress = 1 - Math.pow(1 - progress, 3);

        setAnimatedWeight((latest.weight || 0) * easeProgress);
        setAnimatedBodyFat((latest.bodyFatRate || 0) * easeProgress);
        setAnimatedBmi((latest.bmi || 0) * easeProgress);

        if (currentStep >= steps) {
          clearInterval(interval);
        }
      }, stepDuration);

      return () => clearInterval(interval);
    }
  }, [latest?.weight, latest?.bodyFatRate, latest?.bmi]);

  const activeGoals = goals.filter((g) => g.status === 'active');

  const metricTabs: { key: MetricType; label: string; icon: React.ReactNode }[] = [
    { key: 'weight', label: '体重', icon: <Scale className="w-4 h-4" /> },
    { key: 'bodyFatRate', label: '体脂率', icon: <Percent className="w-4 h-4" /> },
    { key: 'bmi', label: 'BMI', icon: <Activity className="w-4 h-4" /> },
    { key: 'waist', label: '腰围', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  const [activeMetric, setActiveMetric] = useState<MetricType>('weight');

  const trendData = currentMemberId
    ? useAppStore.getState().getTrendData(currentMemberId, activeMetric)
    : [];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            你好，{currentUser?.name} 👋
          </h1>
          <p className="text-gray-500">今天也要加油锻炼，保持健康哦！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Scale className="w-5 h-5 text-primary-500" />
                <span className="text-gray-500 text-sm">当前体重</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                  {animatedWeight.toFixed(1)}
                </span>
                <span className="text-gray-500">kg</span>
              </div>
              {weightChange !== 0 && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  weightChange < 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {weightChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  <span>{Math.abs(weightChange).toFixed(1)}%</span>
                  <span className="opacity-70">较首次</span>
                </div>
              )}
            </div>
          </div>

          <div className="stat-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-secondary-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Percent className="w-5 h-5 text-secondary-500" />
                <span className="text-gray-500 text-sm">体脂率</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                  {animatedBodyFat.toFixed(1)}
                </span>
                <span className="text-gray-500">%</span>
              </div>
              {bodyFatChange !== 0 && (
                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${
                  bodyFatChange < 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                }`}>
                  {bodyFatChange < 0 ? <TrendingDown className="w-3 h-3" /> : <TrendingUp className="w-3 h-3" />}
                  <span>{Math.abs(bodyFatChange).toFixed(1)}%</span>
                  <span className="opacity-70">较首次</span>
                </div>
              )}
            </div>
          </div>

          <div className="stat-card relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-200/30 to-transparent rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-500" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Activity className="w-5 h-5 text-amber-500" />
                <span className="text-gray-500 text-sm">BMI</span>
              </div>
              <div className="flex items-baseline gap-1 mb-2">
                <span className="text-4xl font-bold text-gray-900 tracking-tight">
                  {animatedBmi.toFixed(1)}
                </span>
              </div>
              <span className="inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium bg-amber-100 text-amber-700">
                <Sparkles className="w-3 h-3 mr-1" />
                接近正常范围
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900 text-lg">数据趋势</h2>
                <button
                  onClick={() => navigate('/member/trends')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
                >
                  查看更多
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 mb-6">
                {metricTabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveMetric(tab.key)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      activeMetric === tab.key
                        ? 'bg-primary-100 text-primary-700'
                        : 'text-gray-500 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                ))}
              </div>

              <TrendChart
                data={trendData}
                metric={activeMetric}
                title=""
                height={240}
                color="#10B981"
                gradientId="memberTrendGradient"
              />
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">训练目标</h3>
                <span className="badge badge-success">{activeGoals.length} 个进行中</span>
              </div>
              <div className="space-y-4">
                {activeGoals.slice(0, 2).map((goal) => {
                  const progressNum = Math.min(
                    (goal.currentValue / goal.targetValue) * 100,
                    100
                  );
                  const progress = progressNum.toFixed(0);
                  return (
                    <div key={goal.id} className="p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm text-gray-900">{goal.name}</span>
                        <span className="text-xs text-gray-500">
                          {goal.currentValue}/{goal.targetValue} {goal.unit}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill bg-gradient-to-r from-primary-400 to-secondary-500"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
              <button
                onClick={() => navigate('/member/goals')}
                className="w-full mt-4 py-2.5 rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-primary-300 hover:text-primary-600 transition-colors text-sm font-medium"
              >
                查看全部目标
              </button>
            </div>

            <div className="card p-6 bg-gradient-to-br from-amber-50 to-orange-50">
              <div className="flex items-center gap-2 mb-4">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="font-semibold text-gray-900">健康提醒</h3>
              </div>
              <div className="space-y-3">
                {alerts.slice(0, 2).map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 rounded-xl ${
                      alert.type === 'warning'
                        ? 'bg-amber-100/50 border border-amber-200/50'
                        : 'bg-blue-100/50 border border-blue-200/50'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {alert.type === 'warning' ? (
                        <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-xs font-medium text-gray-800">
                          {alert.metric}: {alert.value}
                          <span className="text-gray-500 font-normal ml-1">
                            (参考 {alert.reference})
                          </span>
                        </p>
                        <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-4 text-center">
                * 以上数据仅供参考，不作为诊断依据
              </p>
            </div>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-6">力量训练进度</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { key: 'benchPress', label: '卧推', color: 'from-violet-400 to-purple-600' },
              { key: 'squat', label: '深蹲', color: 'from-rose-400 to-red-500' },
              { key: 'deadlift', label: '硬拉', color: 'from-cyan-400 to-teal-600' },
            ].map((item) => {
              const data = currentMemberId
                ? useAppStore.getState().getTrendData(currentMemberId, item.key as MetricType)
                : [];
              const latestValue = data.length > 0 ? data[data.length - 1].value : 0;
              const firstValue = data.length > 0 ? data[0].value : 0;
              const change = firstValue > 0 ? ((latestValue - firstValue) / firstValue) * 100 : 0;

              return (
                <div key={item.key} className="p-5 rounded-2xl bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-medium text-gray-700">{item.label}</span>
                    {change > 0 && (
                      <span className="badge badge-success">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        +{change.toFixed(1)}%
                      </span>
                    )}
                  </div>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-bold text-gray-900">{latestValue}</span>
                    <span className="text-gray-500 text-sm">kg</span>
                  </div>
                  <div className={`mt-3 h-1.5 rounded-full bg-gradient-to-r ${item.color}`} style={{ width: '100%' }} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
