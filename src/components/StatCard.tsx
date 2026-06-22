import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  unit?: string;
  change?: number;
  changeLabel?: string;
  icon?: React.ReactNode;
  gradient?: string;
  inverse?: boolean;
}

export default function StatCard({
  title,
  value,
  unit,
  change,
  changeLabel,
  icon,
  gradient = 'from-primary-400 to-secondary-500',
  inverse = false,
}: StatCardProps) {
  const getChangeIcon = () => {
    if (change === undefined || change === 0) return <Minus className="w-4 h-4" />;
    const positive = change > 0;
    const isGood = inverse ? !positive : positive;
    return isGood ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />;
  };

  const getChangeColor = () => {
    if (change === undefined || change === 0) return 'text-gray-500';
    const positive = change > 0;
    const isGood = inverse ? !positive : positive;
    return isGood ? 'text-green-600' : 'text-red-500';
  };

  const getChangeBg = () => {
    if (change === undefined || change === 0) return 'bg-gray-100';
    const positive = change > 0;
    const isGood = inverse ? !positive : positive;
    return isGood ? 'bg-green-100' : 'bg-red-100';
  };

  return (
    <div className="stat-card group hover:shadow-card-hover transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className="text-gray-500 text-sm font-medium">{title}</div>
        {icon && (
          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} text-white flex items-center justify-center shadow-md`}>
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1 mb-3">
        <span className="text-3xl font-bold text-gray-900 tracking-tight">{value}</span>
        {unit && <span className="text-gray-500 text-sm">{unit}</span>}
      </div>

      {change !== undefined && (
        <div className="flex items-center gap-2">
          <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium ${getChangeBg()} ${getChangeColor()}`}>
            {getChangeIcon()}
            <span>{Math.abs(change).toFixed(1)}%</span>
          </div>
          {changeLabel && <span className="text-xs text-gray-400">{changeLabel}</span>}
        </div>
      )}
    </div>
  );
}
