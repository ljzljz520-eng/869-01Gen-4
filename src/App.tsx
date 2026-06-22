import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppStore } from '@/store/useAppStore';
import Login from '@/pages/Login';

import CoachDashboard from '@/pages/coach/CoachDashboard';
import CoachMembers from '@/pages/coach/CoachMembers';
import CoachMemberDetail from '@/pages/coach/CoachMemberDetail';
import CoachTrends from '@/pages/coach/CoachTrends';
import CoachGoals from '@/pages/coach/CoachGoals';

import MemberDashboard from '@/pages/member/MemberDashboard';
import MemberTrends from '@/pages/member/MemberTrends';
import MemberGoals from '@/pages/member/MemberGoals';
import AuthorizationCenter from '@/pages/member/AuthorizationCenter';

import AdminDashboard from '@/pages/admin/AdminDashboard';
import AdminCourses from '@/pages/admin/AdminCourses';
import AdminCoaches from '@/pages/admin/AdminCoaches';
import { Settings } from 'lucide-react';
import AppLayout from './components/AppLayout';

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode; allowedRole: string }) {
  const currentUser = useAppStore((state) => state.currentUser);

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== allowedRole) {
    if (currentUser.role === 'coach') return <Navigate to="/coach" replace />;
    if (currentUser.role === 'member') return <Navigate to="/member" replace />;
    if (currentUser.role === 'admin') return <Navigate to="/admin" replace />;
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminSettings() {
  return (
    <AppLayout>
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">系统设置</h1>
        <div className="card p-12 text-center">
          <Settings className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">系统设置功能开发中...</p>
        </div>
      </div>
    </AppLayout>
  );
}

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/coach"
          element={
            <ProtectedRoute allowedRole="coach">
              <CoachDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/members"
          element={
            <ProtectedRoute allowedRole="coach">
              <CoachMembers />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/members/:id"
          element={
            <ProtectedRoute allowedRole="coach">
              <CoachMemberDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/trends"
          element={
            <ProtectedRoute allowedRole="coach">
              <CoachTrends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coach/goals"
          element={
            <ProtectedRoute allowedRole="coach">
              <CoachGoals />
            </ProtectedRoute>
          }
        />

        <Route
          path="/member"
          element={
            <ProtectedRoute allowedRole="member">
              <MemberDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/trends"
          element={
            <ProtectedRoute allowedRole="member">
              <MemberTrends />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/goals"
          element={
            <ProtectedRoute allowedRole="member">
              <MemberGoals />
            </ProtectedRoute>
          }
        />
        <Route
          path="/member/authorization"
          element={
            <ProtectedRoute allowedRole="member">
              <AuthorizationCenter />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/courses"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/coaches"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminCoaches />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute allowedRole="admin">
              <AdminSettings />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}
