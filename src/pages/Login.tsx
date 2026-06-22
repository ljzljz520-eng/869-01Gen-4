import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, User, Shield, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { useAppStore } from '@/store/useAppStore';
import type { UserRole } from '@/types';

const roleOptions = [
  {
    role: 'member' as UserRole,
    label: '会员',
    icon: User,
    description: '查看体测数据和训练目标',
    gradient: 'from-emerald-400 to-teal-500',
  },
  {
    role: 'coach' as UserRole,
    label: '教练',
    icon: Dumbbell,
    description: '管理会员和录入体测数据',
    gradient: 'from-sky-400 to-blue-500',
  },
  {
    role: 'admin' as UserRole,
    label: '管理员',
    icon: Shield,
    description: '查看统计和后台管理',
    gradient: 'from-violet-400 to-purple-500',
  },
];

export default function Login() {
  const navigate = useNavigate();
  const login = useAppStore((state) => state.login);

  const [selectedRole, setSelectedRole] = useState<UserRole>('member');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      const success = login(selectedRole, username, password);

      if (success) {
        if (selectedRole === 'coach') {
          navigate('/coach');
        } else if (selectedRole === 'member') {
          navigate('/member');
        } else {
          navigate('/admin');
        }
      } else {
        setError('账号或密码错误，请重试');
      }
      setIsLoading(false);
    }, 600);
  };

  const getHintUsername = () => {
    if (selectedRole === 'coach') return 'coach_zhang';
    if (selectedRole === 'member') return 'chen_wei';
    return 'admin';
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-200/30 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-secondary-200/30 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-200/20 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-400 to-secondary-500 text-white mb-4 shadow-lg shadow-primary-500/30">
            <Dumbbell className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            体测<span className="text-gradient-primary">趋势台</span>
          </h1>
          <p className="text-gray-500">专业的健身数据管理平台</p>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-6">
          {roleOptions.map((option) => {
            const Icon = option.icon;
            const isSelected = selectedRole === option.role;
            return (
              <button
                key={option.role}
                type="button"
                onClick={() => setSelectedRole(option.role)}
                className={`relative p-4 rounded-2xl transition-all duration-300 ${
                  isSelected
                    ? 'bg-white shadow-card-hover scale-105'
                    : 'bg-white/50 hover:bg-white/80'
                }`}
              >
                {isSelected && (
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${option.gradient} opacity-10`} />
                )}
                <div className="relative flex flex-col items-center gap-2">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                      isSelected
                        ? `bg-gradient-to-br ${option.gradient} text-white shadow-md`
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className={`text-sm font-medium ${isSelected ? 'text-gray-900' : 'text-gray-600'}`}>
                    {option.label}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label">账号</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={`请输入账号（试试 ${getHintUsername()}）`}
                className="input"
                autoComplete="username"
              />
            </div>

            <div>
              <label className="label">密码</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="请输入密码（任意密码即可）"
                  className="input pr-12"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm bg-red-50 p-3 rounded-xl text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary py-3 text-base group"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  登录
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <p className="text-xs text-gray-400 text-center">
              提示：选择角色后使用对应账号，任意密码即可登录体验
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
