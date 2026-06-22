import { useState } from 'react';
import { Plus, Target, Calendar, CheckCircle2, Clock, TrendingUp } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/store/useAppStore';
import type { Goal } from '@/types';

export default function CoachGoals() {
  const goals = useAppStore((state) => state.goals);
  const members = useAppStore((state) => state.members);
  const addGoal = useAppStore((state) => state.addGoal);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedMember, setSelectedMember] = useState('');
  const [goalType, setGoalType] = useState<Goal['type']>('weight');
  const [goalName, setGoalName] = useState('');
  const [targetValue, setTargetValue] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [unit, setUnit] = useState('kg');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMember || !targetValue || !currentValue || !deadline) return;

    addGoal({
      memberId: selectedMember,
      type: goalType,
      name: goalName || '训练目标',
      targetValue: parseFloat(targetValue),
      currentValue: parseFloat(currentValue),
      unit,
      deadline,
    });

    setShowAddForm(false);
    setSelectedMember('');
    setGoalName('');
    setTargetValue('');
    setCurrentValue('');
    setDeadline('');
  };

  const getGoalWithMember = (goal: Goal) => {
    const member = members.find((m) => m.id === goal.memberId);
    return { ...goal, memberName: member?.name || '未知会员', memberAvatar: member?.avatar };
  };

  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-green-500';
    if (progress >= 60) return 'bg-primary-500';
    if (progress >= 30) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">训练目标</h1>
            <p className="text-gray-500">管理会员的训练目标和进度</p>
          </div>
          <button onClick={() => setShowAddForm(true)} className="btn btn-primary">
            <Plus className="w-4 h-4" />
            新建目标
          </button>
        </div>

        {showAddForm && (
          <div className="card p-6 mb-8 border-2 border-primary-200">
            <h3 className="font-semibold text-gray-900 text-lg mb-4">新建训练目标</h3>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="col-span-2 md:col-span-1">
                <label className="label">选择会员</label>
                <select
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e.target.value)}
                  className="input"
                  required
                >
                  <option value="">请选择会员</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">目标类型</label>
                <select
                  value={goalType}
                  onChange={(e) => setGoalType(e.target.value as Goal['type'])}
                  className="input"
                >
                  <option value="weight">减重目标</option>
                  <option value="bodyFat">体脂目标</option>
                  <option value="strength">力量目标</option>
                  <option value="custom">自定义</option>
                </select>
              </div>
              <div>
                <label className="label">目标名称</label>
                <input
                  type="text"
                  value={goalName}
                  onChange={(e) => setGoalName(e.target.value)}
                  placeholder="如：减重10斤"
                  className="input"
                />
              </div>
              <div>
                <label className="label">当前值</label>
                <input
                  type="number"
                  step="0.1"
                  value={currentValue}
                  onChange={(e) => setCurrentValue(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">目标值</label>
                <input
                  type="number"
                  step="0.1"
                  value={targetValue}
                  onChange={(e) => setTargetValue(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="label">单位</label>
                <input
                  type="text"
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="input"
                />
              </div>
              <div>
                <label className="label">截止日期</label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className="input"
                  required
                />
              </div>
              <div className="col-span-2 md:col-span-3 flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="btn btn-outline"
                >
                  取消
                </button>
                <button type="submit" className="btn btn-primary">
                  创建目标
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-gray-500">进行中目标</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeGoals.length}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-gray-500">已完成目标</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedGoals.length}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-gray-500">平均完成率</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">68%</p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-semibold text-gray-900 text-lg mb-6">进行中的目标</h3>
          <div className="space-y-4">
            {activeGoals.map((goal) => {
              const goalWithMember = getGoalWithMember(goal);
              const progressNum = Math.min(
                (goal.currentValue / goal.targetValue) * 100,
                100
              );
              const progress = progressNum.toFixed(0);
              return (
                <div
                  key={goal.id}
                  className="flex items-center gap-4 p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <img
                    src={goalWithMember.memberAvatar}
                    alt={goalWithMember.memberName}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <span className="font-medium text-gray-900">
                          {goalWithMember.memberName}
                        </span>
                        <span className="ml-2 text-gray-500">· {goal.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {goal.currentValue} / {goal.targetValue} {goal.unit}
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className={`progress-fill ${getProgressColor(progressNum)}`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                    <div className="flex items-center justify-between mt-2 text-xs text-gray-400">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        截止 {goal.deadline}
                      </div>
                      <span>进度 {progress}%</span>
                    </div>
                  </div>
                </div>
              );
            })}
            {activeGoals.length === 0 && (
              <div className="text-center py-12 text-gray-400">
                <Target className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>暂无进行中的目标</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
