import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, ChevronRight, Scale, Percent } from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/store/useAppStore';

export default function CoachMembers() {
  const navigate = useNavigate();
  const members = useAppStore((state) => state.members);
  const getLatestMeasurement = useAppStore((state) => state.getLatestMeasurement);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');

  const filteredMembers = members.filter((member) => {
    const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCourse = filterCourse === 'all' || member.courseId === filterCourse;
    return matchesSearch && matchesCourse;
  });

  const courses = Array.from(new Set(members.map((m) => ({ id: m.courseId, name: m.courseName }))));

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">会员管理</h1>
            <p className="text-gray-500">共 {members.length} 位会员</p>
          </div>
          <button className="btn btn-primary">
            <Plus className="w-4 h-4" />
            添加会员
          </button>
        </div>

        <div className="card p-4 mb-6">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[240px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="搜索会员姓名..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input pl-10"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={filterCourse}
                onChange={(e) => setFilterCourse(e.target.value)}
                className="input min-w-[160px]"
              >
                <option value="all">全部课程</option>
                {courses.map(
                  (course) =>
                    course.id && (
                      <option key={course.id} value={course.id}>
                        {course.name}
                      </option>
                    )
                )}
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMembers.map((member) => {
            const latest = getLatestMeasurement(member.id);
            const measurements = useAppStore.getState().getMemberMeasurements(member.id);
            const firstMeasurement = measurements[0];

            const weightChange =
              latest?.weight && firstMeasurement?.weight
                ? latest.weight - firstMeasurement.weight
                : 0;
            const bodyFatChange =
              latest?.bodyFatRate && firstMeasurement?.bodyFatRate
                ? latest.bodyFatRate - firstMeasurement.bodyFatRate
                : 0;

            return (
              <div
                key={member.id}
                className="card p-6 cursor-pointer group hover:shadow-card-hover transition-all"
                onClick={() => navigate(`/coach/members/${member.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-14 h-14 rounded-xl bg-gray-100"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                        {member.name}
                      </h3>
                      <p className="text-sm text-gray-500">{member.gender === 'male' ? '男' : '女'} · {member.age}岁</p>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary-500 group-hover:translate-x-1 transition-all" />
                </div>

                <div className="flex items-center gap-2 mb-4">
                  <span className="badge badge-info">{member.courseName}</span>
                  <span className="text-xs text-gray-400">
                    教练：{member.primaryCoachName}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-600 flex items-center justify-center">
                      <Scale className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {latest?.weight || '--'}
                      </p>
                      <p className="text-xs text-gray-500">
                        体重
                        {weightChange !== 0 && (
                          <span
                            className={`ml-1 ${weightChange < 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {weightChange > 0 ? '+' : ''}
                            {weightChange.toFixed(1)}kg
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-secondary-100 text-secondary-600 flex items-center justify-center">
                      <Percent className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900">
                        {latest?.bodyFatRate || '--'}
                      </p>
                      <p className="text-xs text-gray-500">
                        体脂率
                        {bodyFatChange !== 0 && (
                          <span
                            className={`ml-1 ${bodyFatChange < 0 ? 'text-green-500' : 'text-red-500'}`}
                          >
                            {bodyFatChange > 0 ? '+' : ''}
                            {bodyFatChange.toFixed(1)}%
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    入营时间：{member.joinDate}
                  </span>
                  <span className="text-xs text-primary-600 font-medium">
                    {measurements.length} 次体测
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {filteredMembers.length === 0 && (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-gray-500">没有找到匹配的会员</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
