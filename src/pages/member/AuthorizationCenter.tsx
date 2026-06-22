import { useState } from 'react';
import {
  ShieldCheck,
  User,
  Clock,
  Check,
  X,
  Calendar,
  AlertCircle,
  Settings,
  Eye,
} from 'lucide-react';
import AppLayout from '@/components/AppLayout';
import { useAppStore } from '@/store/useAppStore';
import type { AuthorizationRequest } from '@/types';

export default function AuthorizationCenter() {
  const currentMemberId = useAppStore((state) => state.currentMemberId);
  const getAuthorizationRequests = useAppStore((state) => state.getAuthorizationRequests);
  const handleAuthorizationRequest = useAppStore((state) => state.handleAuthorizationRequest);

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [expireDays, setExpireDays] = useState<Record<string, number>>({});

  const requests = currentMemberId ? getAuthorizationRequests(currentMemberId) : [];

  const pendingRequests = requests.filter((r) => r.status === 'pending');
  const approvedRequests = requests.filter((r) => r.status === 'approved');
  const rejectedRequests = requests.filter((r) => r.status === 'rejected');

  const displayRequests =
    activeTab === 'pending'
      ? pendingRequests
      : activeTab === 'approved'
      ? approvedRequests
      : rejectedRequests;

  const handleApprove = (requestId: string) => {
    const days = expireDays[requestId] || 30;
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + days);
    handleAuthorizationRequest(requestId, 'approve', expireDate.toISOString().split('T')[0]);
  };

  const handleReject = (requestId: string) => {
    handleAuthorizationRequest(requestId, 'reject');
  };

  const tabs = [
    { key: 'pending' as const, label: '待处理', count: pendingRequests.length },
    { key: 'approved' as const, label: '已授权', count: approvedRequests.length },
    { key: 'rejected' as const, label: '已拒绝', count: rejectedRequests.length },
  ];

  const getStatusBadge = (status: AuthorizationRequest['status']) => {
    switch (status) {
      case 'pending':
        return (
          <span className="badge bg-amber-100 text-amber-700">
            <Clock className="w-3 h-3 mr-1" />
            待处理
          </span>
        );
      case 'approved':
        return (
          <span className="badge bg-green-100 text-green-700">
            <Check className="w-3 h-3 mr-1" />
            已授权
          </span>
        );
      case 'rejected':
        return (
          <span className="badge bg-red-100 text-red-700">
            <X className="w-3 h-3 mr-1" />
            已拒绝
          </span>
        );
    }
  };

  return (
    <AppLayout>
      <div className="animate-fade-in">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">授权中心</h1>
          <p className="text-gray-500">管理你的体测数据分享权限</p>
        </div>

        <div className="card p-6 mb-6 bg-gradient-to-r from-primary-50 to-secondary-50">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-6 h-6 text-primary-500" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">数据隐私保护</h3>
              <p className="text-sm text-gray-600 mb-3">
                你的体测数据受到严格保护。只有获得你授权的教练才能查看你的数据。
                你可以随时撤销授权。
              </p>
              <div className="flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Eye className="w-3 h-3" />
                  授权教练可查看体测数据
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  可设置授权有效期
                </span>
                <span className="inline-flex items-center gap-1 text-xs text-gray-500">
                  <Settings className="w-3 h-3" />
                  随时可以撤销授权
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-5 py-2.5 rounded-xl font-medium transition-all ${
                activeTab === tab.key
                  ? 'bg-primary-500 text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 text-gray-500'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          {displayRequests.map((request) => (
            <div key={request.id} className="card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                    <User className="w-7 h-7 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.coachName}
                    </h3>
                    <p className="text-sm text-gray-500">申请查看你的体测数据</p>
                  </div>
                </div>
                {getStatusBadge(request.status)}
              </div>

              <div className="bg-gray-50 rounded-xl p-4 mb-4">
                <p className="text-sm text-gray-500 mb-1">申请理由</p>
                <p className="text-gray-700">{request.reason}</p>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span>申请时间：{request.createdAt}</span>
                {request.expireAt && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    有效期至：{request.expireAt}
                  </span>
                )}
              </div>

              {request.status === 'pending' && (
                <div className="space-y-4">
                  <div>
                    <label className="label">授权有效期</label>
                    <select
                      value={expireDays[request.id] || 30}
                      onChange={(e) =>
                        setExpireDays((prev) => ({
                          ...prev,
                          [request.id]: parseInt(e.target.value),
                        }))
                      }
                      className="input max-w-[200px]"
                    >
                      <option value={7}>7 天</option>
                      <option value={30}>30 天</option>
                      <option value={90}>90 天</option>
                      <option value={180}>180 天</option>
                      <option value={365}>1 年</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleReject(request.id)}
                      className="flex-1 py-3 rounded-xl border-2 border-gray-200 text-gray-600 hover:border-red-200 hover:text-red-600 hover:bg-red-50 font-medium transition-all flex items-center justify-center gap-2"
                    >
                      <X className="w-4 h-4" />
                      拒绝
                    </button>
                    <button
                      onClick={() => handleApprove(request.id)}
                      className="flex-1 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-medium shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      同意授权
                    </button>
                  </div>
                </div>
              )}

              {request.status === 'approved' && (
                <button
                  onClick={() => handleReject(request.id)}
                  className="w-full py-2.5 rounded-xl border border-gray-200 text-gray-500 hover:border-red-200 hover:text-red-500 hover:bg-red-50 text-sm font-medium transition-all"
                >
                  撤销授权
                </button>
              )}
            </div>
          ))}

          {displayRequests.length === 0 && (
            <div className="card p-12 text-center">
              <ShieldCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-1">
                {activeTab === 'pending'
                  ? '暂无待处理的授权申请'
                  : activeTab === 'approved'
                  ? '暂无已授权的教练'
                  : '暂无已拒绝的申请'}
              </p>
              <p className="text-gray-400 text-sm">
                {activeTab === 'pending'
                  ? '当有教练申请查看你的数据时，会在这里显示'
                  : '新的申请会出现在待处理列表中'}
              </p>
            </div>
          )}
        </div>

        {activeTab === 'pending' && pendingRequests.length > 0 && (
          <div className="mt-8 card p-5 border-amber-200 bg-amber-50/50">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-amber-700">
                <p className="font-medium mb-1">温馨提示</p>
                <p>
                  请仔细核实申请教练的身份，只授权给你信任的教练。
                  授权后对方可以查看你的所有体测数据，包括历史记录。
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
