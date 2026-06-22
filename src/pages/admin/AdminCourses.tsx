import { useState } from 'react';
import {
  GraduationCap,
  Users,
  TrendingUp,
  CheckCircle2,
  Search,
  Filter,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/store/useAppStore';
import type { CourseStats } from '@/types';

export default function AdminCourses() {
  const courseStats = useAppStore((state) => state.getCourseStats());
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'improvement' | 'members'>('improvement');

  const sortedCourses = [...courseStats]
    .filter((c) => c.courseName.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      if (sortBy === 'name') return a.courseName.localeCompare(b.courseName);
      if (sortBy === 'improvement') return b.avgImprovement - a.avgImprovement;
      if (sortBy === 'members') return b.memberCount - a.memberCount;
      return 0;
    });

  const getRankBadge = (index: number) => {
    if (index === 0) return <span className="badge bg-amber-100 text-amber-700">🥇 第1名</span>;
    if (index === 1) return <span className="badge bg-gray-100 text-gray-700">🥈 第2名</span>;
    if (index === 2) return <span className="badge bg-orange-100 text-orange-700">🥉 第3名</span>;
    return <span className="badge bg-gray-50 text-gray-500">第{index + 1}名</span>;
  };

  const totalMembers = courseStats.reduce((sum, c) => sum + c.memberCount, 0);
  const avgImprovement = (
    courseStats.reduce((sum, c) => sum + c.avgImprovement, 0) / courseStats.length
  ).toFixed(1);

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">课程统计</h1>
            <p className="text-gray-500">按课程查看会员整体改善情况</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-primary-100 text-primary-600 flex items-center justify-center">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">课程总数</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{courseStats.length}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-secondary-100 text-secondary-600 flex items-center justify-center">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">会员总数</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{totalMembers}</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">平均改善率</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{avgImprovement}%</p>
          </div>
          <div className="stat-card">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-green-100 text-green-600 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <span className="text-gray-500 text-sm">平均完成率</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">
              {Math.round(
                courseStats.reduce((sum, c) => sum + c.completionRate, 0) / courseStats.length
              )}
              %
            </p>
          </div>
        </div>

        <div className="card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索课程..."
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
                <option value="improvement">按改善率排序</option>
                <option value="members">按会员数排序</option>
                <option value="name">按名称排序</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {sortedCourses.map((course, index) => (
            <div key={course.courseId} className="card p-6 hover:shadow-card-hover transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <GraduationCap className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {course.courseName}
                      </h3>
                      {getRankBadge(index)}
                    </div>
                    <p className="text-sm text-gray-500">
                      {course.memberCount} 位会员
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-primary-600">
                    {course.avgImprovement}%
                  </p>
                  <p className="text-sm text-gray-500">平均改善率</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-4 border-t border-gray-100">
                <div>
                  <p className="text-sm text-gray-500 mb-1">会员人数</p>
                  <p className="text-xl font-semibold text-gray-900">
                    {course.memberCount} <span className="text-sm font-normal text-gray-500">人</span>
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">平均改善</p>
                  <p className="text-xl font-semibold text-green-600">
                    +{course.avgImprovement}%
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">完成率</p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 progress-bar">
                      <div
                        className="progress-fill bg-gradient-to-r from-primary-400 to-secondary-500"
                        style={{ width: `${course.completionRate}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {course.completionRate}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
