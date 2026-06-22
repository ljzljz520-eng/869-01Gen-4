import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Calendar,
  User,
  Scale,
  Ruler,
  Dumbbell,
  Target,
  ChevronDown,
  ChevronUp,
  Save,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import TrendChart from '@/components/TrendChart';
import { useAppStore } from '@/store/useAppStore';
import type { MetricType, Measurement } from '@/types';

export default function CoachMemberDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const members = useAppStore((state) => state.members);
  const getMemberMeasurements = useAppStore((state) => state.getMemberMeasurements);
  const getMemberGoals = useAppStore((state) => state.getMemberGoals);
  const addMeasurement = useAppStore((state) => state.addMeasurement);
  const currentUser = useAppStore((state) => state.currentUser);

  const member = members.find((m) => m.id === id);
  const measurements = id ? getMemberMeasurements(id) : [];
  const goals = id ? getMemberGoals(id) : [];
  const latest = measurements[measurements.length - 1];

  const [showAddForm, setShowAddForm] = useState(false);
  const [activeMetric, setActiveMetric] = useState<MetricType>('weight');
  const [expandedSections, setExpandedSections] = useState({
    body: true,
    circumference: true,
    strength: true,
  });

  const [formData, setFormData] = useState<Partial<Measurement>>({
    weight: latest?.weight,
    bodyFatRate: latest?.bodyFatRate,
    bmi: latest?.bmi,
    waist: latest?.waist,
    hip: latest?.hip,
    chest: latest?.chest,
    arm: latest?.arm,
    thigh: latest?.thigh,
    benchPress: latest?.benchPress,
    squat: latest?.squat,
    deadlift: latest?.deadlift,
    notes: '',
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value === '' ? undefined : parseFloat(value),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id || !currentUser) return;

    addMeasurement(id, {
      coachId: currentUser.id,
      coachName: currentUser.name,
      measuredAt: new Date().toISOString().split('T')[0],
      ...formData,
    } as Omit<Measurement, 'id' | 'memberId'>);

    setShowAddForm(false);
  };

  const metricTabs: { key: MetricType; label: string }[] = [
    { key: 'weight', label: '体重' },
    { key: 'bodyFatRate', label: '体脂率' },
    { key: 'bmi', label: 'BMI' },
    { key: 'waist', label: '腰围' },
    { key: 'benchPress', label: '卧推' },
    { key: 'squat', label: '深蹲' },
    { key: 'deadlift', label: '硬拉' },
  ];

  if (!member) {
    return (
      <AppLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">会员不存在</p>
        </div>
      </AppLayout>
    );
  }

  const trendData = id ? useAppStore.getState().getTrendData(id, activeMetric) : [];

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <button
          onClick={() => navigate('/coach/members')}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回会员列表
        </button>

        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-16 h-16 rounded-2xl bg-gray-100"
              />
              <div>
                <h1 className="text-xl font-bold text-gray-900">{member.name}</h1>
                <div className="flex items-center gap-3 mt-1 text-sm text-gray-500">
                  <span>
                    {member.gender === 'male' ? '男' : '女'} · {member.age}岁 · {member.height}cm
                  </span>
                  <span className="badge badge-info">{member.courseName}</span>
                  <span>教练：{member.primaryCoachName}</span>
                </div>
              </div>
            </div>
            <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
              <Plus className="w-4 h-4" />
              录入体测
            </button>
          </div>
        </div>

        {showAddForm && (
          <div className="card p-6 mb-6 border-2 border-primary-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">录入体测数据</h2>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Calendar className="w-4 h-4" />
                {new Date().toLocaleDateString('zh-CN')}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleSection('body')}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">身体成分</span>
                  </div>
                  {expandedSections.body ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.body && (
                  <div className="grid grid-cols-3 gap-4 mt-4 p-4">
                    <div>
                      <label className="label">体重 (kg)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.weight ?? ''}
                        onChange={(e) => handleInputChange('weight', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">体脂率 (%)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.bodyFatRate ?? ''}
                        onChange={(e) => handleInputChange('bodyFatRate', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">BMI</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.bmi ?? ''}
                        onChange={(e) => handleInputChange('bmi', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-4">
                <button
                  type="button"
                  onClick={() => toggleSection('circumference')}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center">
                      <Ruler className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">围度数据</span>
                  </div>
                  {expandedSections.circumference ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.circumference && (
                  <div className="grid grid-cols-5 gap-4 mt-4 p-4">
                    <div>
                      <label className="label">腰围 (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.waist ?? ''}
                        onChange={(e) => handleInputChange('waist', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">臀围 (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.hip ?? ''}
                        onChange={(e) => handleInputChange('hip', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">胸围 (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.chest ?? ''}
                        onChange={(e) => handleInputChange('chest', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">臂围 (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.arm ?? ''}
                        onChange={(e) => handleInputChange('arm', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">大腿围 (cm)</label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.thigh ?? ''}
                        onChange={(e) => handleInputChange('thigh', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <button
                  type="button"
                  onClick={() => toggleSection('strength')}
                  className="flex items-center justify-between w-full p-4 bg-gray-50 rounded-xl"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-600 flex items-center justify-center">
                      <Dumbbell className="w-4 h-4" />
                    </div>
                    <span className="font-medium text-gray-900">力量测试</span>
                  </div>
                  {expandedSections.strength ? (
                    <ChevronUp className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  )}
                </button>
                {expandedSections.strength && (
                  <div className="grid grid-cols-3 gap-4 mt-4 p-4">
                    <div>
                      <label className="label">卧推 (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.benchPress ?? ''}
                        onChange={(e) => handleInputChange('benchPress', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">深蹲 (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.squat ?? ''}
                        onChange={(e) => handleInputChange('squat', e.target.value)}
                        className="input"
                      />
                    </div>
                    <div>
                      <label className="label">硬拉 (kg)</label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.deadlift ?? ''}
                        onChange={(e) => handleInputChange('deadlift', e.target.value)}
                        className="input"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="mb-6">
                <label className="label">备注</label>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="添加备注信息..."
                  className="input min-h-[80px] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-outline"
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save className="w-4 h-4" />
                  保存数据
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Scale className="w-5 h-5 text-primary-500" />
              <span className="text-gray-500 text-sm">体重</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{latest?.weight || '--'}</span>
              <span className="text-gray-500 text-sm">kg</span>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <Target className="w-5 h-5 text-secondary-500" />
              <span className="text-gray-500 text-sm">体脂率</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{latest?.bodyFatRate || '--'}</span>
              <span className="text-gray-500 text-sm">%</span>
            </div>
          </div>
          <div className="card p-5">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-5 h-5 text-amber-500" />
              <span className="text-gray-500 text-sm">BMI</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold text-gray-900">{latest?.bmi || '--'}</span>
              <span className="text-gray-500 text-sm"></span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
            {metricTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveMetric(tab.key)}
                className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                  activeMetric === tab.key
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <TrendChart
            data={trendData}
            metric={activeMetric}
            title={`${metricTabs.find((t) => t.key === activeMetric)?.label}趋势`}
            color="#10B981"
            gradientId="trendGradient"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">训练目标</h3>
            <div className="space-y-4">
              {goals.map((goal) => {
                const progress = ((goal.currentValue / goal.targetValue) * 100).toFixed(0);
                return (
                  <div key={goal.id} className="p-4 bg-gray-50 rounded-xl">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{goal.name}</span>
                      <span className="text-sm text-gray-500">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill bg-gradient-to-r from-primary-400 to-primary-600"
                        style={{ width: `${Math.min(parseInt(progress), 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-400">
                      <span>进度 {progress}%</span>
                      <span>截止 {goal.deadline}</span>
                    </div>
                  </div>
                );
              })}
              {goals.length === 0 && (
                <p className="text-gray-400 text-center py-8">暂无训练目标</p>
              )}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">历史记录</h3>
            <div className="space-y-3 max-h-[360px] overflow-y-auto scrollbar-hide">
              {measurements.slice().reverse().map((m, index) => (
                <div
                  key={m.id}
                  className={`flex items-center justify-between p-3 rounded-xl ${
                    index === 0 ? 'bg-primary-50 border border-primary-100' : 'bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        index === 0
                          ? 'bg-primary-100 text-primary-600'
                          : 'bg-white text-gray-500'
                      }`}
                    >
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{m.measuredAt}</p>
                      <p className="text-xs text-gray-500">录入：{m.coachName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">{m.weight} kg</p>
                    <p className="text-xs text-gray-500">体脂 {m.bodyFatRate}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
