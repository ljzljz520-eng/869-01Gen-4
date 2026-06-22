import { useState } from 'react';
import {
  UserCheck,
  Users,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Dumbbell,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/store/useAppStore';

export default function AdminCoaches() {
  const coachStats = useAppStore((state) => state.getCoachStats());
  const coaches = useAppStore((state) => state.coaches);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'members' | 'strength'>('members');

  const enrichedCoaches = coachStats.map((stat) => {
    const coachInfo = coaches.find((c) => c.id === stat.coachId);
    return { ...stat, specialty: coachInfo?.specialty || '', avatar: coachInfo?.avatar };
  });

  const sortedCoaches = [...enrichedCoaches]
    .filter((c) => c.coachName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.coachName.localeCompare(b.coachName);
      if (sortBy === 'members') return b.memberCount - a.memberCount;
      if (sortBy === 'strength') return b.avgStrengthChange - a.avgStrengthChange;
      return 0;
    });

  const totalMembers = coachStats.reduce((sum, c) => sum + c.memberCount, 0);
  const avgStrengthChange = (
    coachStats.reduce((sum, c) => sum + c.avgStrengthChange, 0) / coachStats.length
  ).toFixed(1);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">教练统计</h1>
            <p className="text-gray-500">按教练查看学员整体改善数据</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">教练总数</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{coachStats.length}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">总会员数</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalMembers}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <TrendingDown className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">平均体重变化</span>
            </div>
            <p className="text-3xl font-bold text-green-600">
              {(
                coachStats.reduce((sum, c) => sum + c.avgWeightChange, 0) / coachStats.length
              ).toFixed(1)}
              kg
            </p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <Dumbbell className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">平均力量提升</span>
            </div>
            <p className="text-3xl font-bold text-amber-600">+{avgStrengthChange}%</p>
          </div>
        </div>

        <div className="card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索教练..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                className="input min-w-[160px]"
              >
                <option value="members">按会员数排序</option>
                <option value="strength">按力量提升排序</option>
                <option value="name">按姓名排序</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedCoaches.map((coach, index) => (
            <div key={coach.coachId} className="card p-6 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-4">
                  {coach.avatar ? (
                    <img
                      src={coach.avatar}
                      alt={coach.coachName}
                      className="w-14 h-14 rounded-2xl bg-gray-100"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                      <UserCheck className="w-7 h-7 text-primary-700" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{coach.coachName}</h3>
                    <p className="text-sm text-gray-500">{coach.specialty}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-lg font-semibold text-gray-900">
                      {coach.memberCount}
                    </span>
                    <span className="text-gray-500 text-sm">位会员</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500">体重变化</span>
                  </div>
                  <p className={`text-2xl font-bold ${coach.avgWeightChange < 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {coach.avgWeightChange > 0 ? '+' : ''}
                    {coach.avgWeightChange.toFixed(1)} kg
                  </p>
                  <p className="text-xs text-gray-400 mt-1">平均减少</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingDown className="w-4 h-4 text-green-500" />
                    <span className="text-sm text-gray-500">体脂变化</span>
                  </div>
                  <p className={`text-2xl font-bold ${coach.avgBodyFatChange < 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {coach.avgBodyFatChange > 0 ? '+' : ''}
                    {coach.avgBodyFatChange.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">平均减少</p>
                </div>

                <div className="p-4 bg-gray-50 rounded-xl">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-4 h-4 text-amber-500" />
                    <span className="text-sm text-gray-500">力量提升</span>
                  </div>
                  <p className="text-2xl font-bold text-amber-600">
                    +{coach.avgStrengthChange.toFixed(1)}%
                  </p>
                  <p className="text-xs text-gray-400 mt-1">平均提升</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
