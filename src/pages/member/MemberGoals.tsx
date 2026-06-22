import { Target, Calendar, CheckCircle2, Clock, Trophy, Flame } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/store/useAppStore';
import type { Goal } from '@/types';

export default function MemberGoals() {
  const currentMemberId = useAppStore((state) => state.currentMemberId);
  const getMemberGoals = useAppStore((state) => state.getMemberGoals);

  const goals = currentMemberId ? getMemberGoals(currentMemberId) : [];
  const activeGoals = goals.filter((g) => g.status === 'active');
  const completedGoals = goals.filter((g) => g.status === 'completed');

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'from-green-400 to-green-600';
    if (progress >= 60) return 'from-primary-400 to-primary-600';
    if (progress >= 30) return 'from-amber-400 to-orange-500';
    return 'from-red-400 to-red-600';
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diff = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff;
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">训练目标</h1>
          <p className="text-gray-500">跟踪你的训练目标完成进度</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <Target className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">进行中</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{activeGoals.length}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <Trophy className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">已完成</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{completedGoals.length}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Flame className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">完成率</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {goals.length > 0 ? Math.round((completedGoals.length / goals.length) * 100) : 0}%
            </p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 text-violet-600 flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">总目标</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{goals.length}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-primary-500" />
            进行中的目标
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {activeGoals.map((goal) => {
              const progress = Math.min(
                parseInt(((goal.currentValue / goal.targetValue) * 100).toFixed(0)),
                100
              );
              const daysLeft = getDaysLeft(goal.deadline);

              return (
                <div
                  key={goal.id}
                  className="card p-6 hover:shadow-card-hover transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                        goal.type === 'weight' ? 'bg-primary-100 text-primary-700' :
                        goal.type === 'bodyFat' ? 'bg-secondary-100 text-secondary-700' :
                        goal.type === 'strength' ? 'bg-amber-100 text-amber-700' :
                        'bg-violet-100 text-violet-700'
                      }`}>
                        {goal.type === 'weight' ? '减重目标' :
                         goal.type === 'bodyFat' ? '体脂目标' :
                         goal.type === 'strength' ? '力量目标' : '自定义目标'}
                      </span>
                      <h3 className="text-xl font-semibold text-gray-900">{goal.name}</h3>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">剩余</p>
                      <p className={`font-bold ${daysLeft < 30 ? 'text-amber-600' : 'text-gray-900'}`}>
                        {daysLeft} 天
                      </p>
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2 mb-4">
                    <span className="text-3xl font-bold text-gray-900">
                      {goal.currentValue}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="text-xl text-gray-500">
                      {goal.targetValue} {goal.unit}
                    </span>
                  </div>

                  <div className="mb-2">
                    <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(progress)} transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">进度 {progress}%</span>
                    <span className="text-gray-400 flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {goal.deadline}
                    </span>
                  </div>
                </div>
              );
            })}
            {activeGoals.length === 0 && (
              <div className="col-span-2 card p-12 text-center">
                <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">暂无进行中的目标</p>
                <p className="text-gray-400 text-sm mt-1">联系你的教练设置训练目标吧</p>
              </div>
            )}
          </div>
        </div>

        {completedGoals.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
              已完成的目标
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {completedGoals.map((goal) => (
                <div
                  key={goal.id}
                  className="card p-5 opacity-75"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-gray-900">{goal.name}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {goal.targetValue} {goal.unit}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
