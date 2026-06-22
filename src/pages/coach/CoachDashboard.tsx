import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Target, ClipboardList, UserPlus, Plus } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/StatCard';
import { useAppStore } from '@/store/useAppStore';

export default function CoachDashboard() {
  const navigate = useNavigate();
  const members = useAppStore((state) => state.members);
  const getLatestMeasurement = useAppStore((state) => state.getLatestMeasurement);
  const goals = useAppStore((state) => state.goals);
  const currentUser = useAppStore((state) => state.currentUser);

  const activeGoals = goals.filter((g) => g.status === 'active').length;

  const recentMembers = members.slice(0, 5).map((member) => {
    const latest = getLatestMeasurement(member.id);
    return {
      ...member,
      latestWeight: latest?.weight,
      latestBodyFat: latest?.bodyFatRate,
    };
  });

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            你好，{currentUser?.name} 👋
          </h1>
          <p className="text-gray-500">今天也是元气满满的一天，开始工作吧！</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="会员总数"
            value={members.length}
            icon={<Users className="w-5 h-5" />}
            change={12.5}
            changeLabel="较上月"
            gradient="from-primary-400 to-primary-600"
          />
          <StatCard
            title="本月体测"
            value="42"
            unit="次"
            icon={<ClipboardList className="w-5 h-5" />}
            change={8.3}
            changeLabel="较上月"
            gradient="from-secondary-400 to-secondary-600"
          />
          <StatCard
            title="进行中目标"
            value={activeGoals}
            icon={<Target className="w-5 h-5" />}
            change={5.2}
            changeLabel="较上月"
            gradient="from-amber-400 to-orange-500"
          />
          <StatCard
            title="平均改善率"
            value="12.5"
            unit="%"
            icon={<TrendingUp className="w-5 h-5" />}
            change={3.1}
            changeLabel="较上月"
            gradient="from-violet-400 to-purple-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="card p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-semibold text-gray-900 text-lg">最近会员</h2>
                <button
                  onClick={() => navigate('/coach/members')}
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  查看全部 →
                </button>
              </div>

              <div className="space-y-3">
                {recentMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/coach/members/${member.id}`)}
                  >
                    <div className="flex items-center gap-4">
                      <img
                        src={member.avatar}
                        alt={member.name}
                        className="w-12 h-12 rounded-full bg-gray-100"
                      />
                      <div>
                        <p className="font-medium text-gray-900 group-hover:text-primary-600 transition-colors">
                          {member.name}
                        </p>
                        <p className="text-sm text-gray-500">{member.courseName}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-gray-500">体重</p>
                        <p className="font-medium text-gray-900">
                          {member.latestWeight} kg
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">体脂率</p>
                        <p className="font-medium text-gray-900">
                          {member.latestBodyFat}%
                        </p>
                      </div>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                          <Plus className="w-4 h-4 rotate-45" />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="card p-6">
              <h2 className="font-semibold text-gray-900 text-lg mb-4">快捷操作</h2>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate('/coach/members')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-primary-50 hover:bg-primary-100 text-primary-700 transition-colors"
                >
                  <Users className="w-6 h-6" />
                  <span className="text-sm font-medium">会员管理</span>
                </button>
                <button
                  onClick={() => navigate('/coach/trends')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-secondary-50 hover:bg-secondary-100 text-secondary-700 transition-colors"
                >
                  <TrendingUp className="w-6 h-6" />
                  <span className="text-sm font-medium">趋势分析</span>
                </button>
                <button
                  onClick={() => navigate('/coach/goals')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors"
                >
                  <Target className="w-6 h-6" />
                  <span className="text-sm font-medium">训练目标</span>
                </button>
                <button
                  onClick={() => navigate('/coach/members')}
                  className="flex flex-col items-center gap-2 p-4 rounded-xl bg-violet-50 hover:bg-violet-100 text-violet-700 transition-colors"
                >
                  <UserPlus className="w-6 h-6" />
                  <span className="text-sm font-medium">添加会员</span>
                </button>
              </div>
            </div>

            <div className="card p-6 bg-gradient-to-br from-primary-500 to-secondary-500 text-white">
              <h3 className="font-semibold text-lg mb-2">本周提醒</h3>
              <p className="text-white/80 text-sm mb-4">
                您有 3 位会员本周需要进行体测
              </p>
              <button
                onClick={() => navigate('/coach/members')}
                className="w-full py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white font-medium text-sm transition-colors"
              >
                查看详情
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
