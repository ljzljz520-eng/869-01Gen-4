import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  TrendingUp,
  Target,
  ShieldCheck,
  BarChart3,
  GraduationCap,
  LogOut,
  Dumbbell,
  Settings,
  User,
} from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { UserRole } from '@/types';

interface SidebarProps {
  role: UserRole;
}

const coachNavItems = [
  { path: '/coach', icon: LayoutDashboard, label: '工作台' },
  { path: '/coach/members', icon: Users, label: '会员管理' },
  { path: '/coach/trends', icon: TrendingUp, label: '趋势分析' },
  { path: '/coach/goals', icon: Target, label: '训练目标' },
];

const memberNavItems = [
  { path: '/member', icon: LayoutDashboard, label: '我的仪表盘' },
  { path: '/member/trends', icon: TrendingUp, label: '体测趋势' },
  { path: '/member/goals', icon: Target, label: '训练目标' },
  { path: '/member/authorization', icon: ShieldCheck, label: '授权中心' },
];

const adminNavItems = [
  { path: '/admin', icon: BarChart3, label: '数据看板' },
  { path: '/admin/courses', icon: GraduationCap, label: '课程统计' },
  { path: '/admin/coaches', icon: Users, label: '教练统计' },
  { path: '/admin/settings', icon: Settings, label: '系统设置' },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = useAppStore((state) => state.currentUser);
  const logout = useAppStore((state) => state.logout);

  const role = currentUser?.role as UserRole;

  const getNavItems = () => {
    if (role === 'coach') return coachNavItems;
    if (role === 'member') return memberNavItems;
    if (role === 'admin') return adminNavItems;
    return [];
  };

  const navItems = getNavItems();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    if (path.split('/').length === 2) {
      return location.pathname === path;
    }
    return location.pathname.startsWith(path);
  };

  const getRoleBadge = () => {
    if (role === 'coach') return { text: '教练', color: 'bg-sky-100 text-sky-700' };
    if (role === 'member') return { text: '会员', color: 'bg-emerald-100 text-emerald-700' };
    if (role === 'admin') return { text: '管理员', color: 'bg-violet-100 text-violet-700' };
    return { text: '', color: '' };
  };

  const badge = getRoleBadge();

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 flex-shrink-0 bg-white/80 backdrop-blur-lg border-r border-gray-100 flex flex-col">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-400 to-secondary-500 text-white flex items-center justify-center">
              <Dumbbell className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-bold text-gray-900">体测趋势台</h1>
              <p className="text-xs text-gray-500">专业健身数据管理</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`sidebar-item ${active ? 'sidebar-item-active' : ''}`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-4">
            {currentUser?.avatar ? (
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="w-5 h-5 text-gray-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-900 truncate">{currentUser?.name}</p>
              <span className={`badge ${badge.color}`}>{badge.text}</span>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full btn btn-ghost w-full text-sm text-gray-500 hover:text-red-600 hover:bg-red-50"
          >
            <LogOut className="w-4 h-4" />
            退出登录
          </button>
        </div>
      </aside>

      <main className="flex-1 min-h-screen overflow-auto">
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}
