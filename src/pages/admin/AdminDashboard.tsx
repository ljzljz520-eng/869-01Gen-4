import {
  Users,
  UserCheck,
  ClipboardList,
  TrendingUp,
  Target,
  BarChart3,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import AppLayout from '@/components/AppLayout';
import StatCard from '@/components/StatCard';
import { useAppStore } from '@/store/useAppStore';

export default function AdminDashboard() {
  const overviewStats = useAppStore((state) => state.getOverviewStats());
  const coachStats = useAppStore((state) => state.getCoachStats());
  const courseStats = useAppStore((state) => state.getCourseStats());

  const barData = coachStats.map((stat) => ({
    name: stat.coachName,
    体重改善: stat.avgWeightChange,
    体脂改善: stat.avgBodyFatChange,
    力量提升: stat.avgStrengthChange,
  }));

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">数据看板</h1>
          <p className="text-gray-500">健身房整体运营数据概览</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <StatCard
            title="会员总数"
            value={overviewStats.totalMembers}
            icon={<Users className="w-5 h-5" />}
            change={8.5}
            changeLabel="较上月"
            gradient="from-primary-400 to-primary-600"
          />
          <StatCard
            title="教练总数"
            value={overviewStats.totalCoaches}
            icon={<UserCheck className="w-5 h-5" />}
            gradient="from-secondary-400 to-secondary-600"
          />
          <StatCard
            title="体测记录"
            value={overviewStats.totalMeasurements}
            icon={<ClipboardList className="w-5 h-5" />}
            change={15.2}
            changeLabel="较上月"
            gradient="from-amber-400 to-orange-500"
          />
          <StatCard
            title="平均改善率"
            value={overviewStats.avgImprovementRate}
            unit="%"
            icon={<TrendingUp className="w-5 h-5" />}
            change={3.2}
            changeLabel="较上月"
            gradient="from-violet-400 to-purple-600"
          />
          <StatCard
            title="活跃目标"
            value={overviewStats.activeGoals}
            icon={<Target className="w-5 h-5" />}
            change={12.8}
            changeLabel="较上月"
            gradient="from-rose-400 to-pink-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 text-lg mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary-500" />
              教练效果对比
            </h2>
            <div style={{ height: 300 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      borderRadius: '12px',
                      border: '1px solid #f0f0f0',
                      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    }}
                  />
                  <Bar dataKey="体重改善" fill="#10B981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="体脂改善" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="力量提升" fill="#F59E0B" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="card p-6">
            <h2 className="font-semibold text-gray-900 text-lg mb-6">课程效果排行</h2>
            <div className="space-y-4">
              {[...courseStats].sort((a, b) => b.avgImprovement - a.avgImprovement).map((course, index) => (
                <div key={course.courseId} className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0
                      ? 'bg-amber-100 text-amber-700'
                      : index === 1
                      ? 'bg-gray-100 text-gray-600'
                      : index === 2
                      ? 'bg-orange-100 text-orange-700'
                      : 'bg-gray-50 text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-medium text-gray-900">{course.courseName}</span>
                      <span className="text-sm font-semibold text-primary-600">
                        {course.avgImprovement}%
                      </span>
                    </div>
                    <div className="progress-bar">
                      <div
                        className="progress-fill bg-gradient-to-r from-primary-400 to-primary-600"
                        style={{ width: `${(course.avgImprovement / 25) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">教练概览</h3>
            <div className="space-y-3">
              {coachStats.map((stat) => (
                <div
                  key={stat.coachId}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-200 to-secondary-200 flex items-center justify-center">
                      <UserCheck className="w-5 h-5 text-primary-700" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{stat.coachName}</p>
                      <p className="text-xs text-gray-500">{stat.memberCount} 位会员</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-primary-600">
                      平均改善 {((Math.abs(stat.avgWeightChange) + Math.abs(stat.avgBodyFatChange) + stat.avgStrengthChange) / 3).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-semibold text-gray-900 mb-4">课程概览</h3>
            <div className="space-y-3">
              {courseStats.map((course) => (
                <div
                  key={course.courseId}
                  className="flex items-center justify-between p-3 rounded-xl bg-gray-50"
                >
                  <div>
                    <p className="font-medium text-gray-900">{course.courseName}</p>
                    <p className="text-xs text-gray-500">
                      {course.memberCount} 位会员 · 完成率 {course.completionRate}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary-600">
                      {course.avgImprovement}%
                    </p>
                    <p className="text-xs text-gray-500">平均改善</p>
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
