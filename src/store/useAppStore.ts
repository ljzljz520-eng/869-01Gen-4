import { create } from 'zustand';
import type {
  User,
  Member,
  Coach,
  Measurement,
  Goal,
  AuthorizationRequest,
  Course,
  UserRole,
} from '@/types';
import {
  mockCoaches,
  mockMembers,
  mockMeasurements,
  mockGoals,
  mockAuthorizationRequests,
  mockCourses,
  mockHealthAlerts,
  mockOverviewStats,
  mockCoachStats,
  mockCourseStats,
  getTrendData,
} from '@/data/mockData';

interface AppState {
  currentUser: User | null;
  currentMemberId: string | null;

  coaches: Coach[];
  members: Member[];
  measurements: Record<string, Measurement[]>;
  goals: Goal[];
  authorizationRequests: AuthorizationRequest[];
  courses: Course[];

  login: (role: UserRole, username: string, password: string) => boolean;
  logout: () => void;

  setCurrentMemberId: (id: string | null) => void;
  getMemberMeasurements: (memberId: string) => Measurement[];
  getLatestMeasurement: (memberId: string) => Measurement | null;
  getMemberGoals: (memberId: string) => Goal[];
  getTrendData: (memberId: string, metric: string) => { date: string; value: number }[];
  getHealthAlerts: () => typeof mockHealthAlerts;

  addMeasurement: (memberId: string, measurement: Omit<Measurement, 'id' | 'memberId'>) => void;
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'status'>) => void;

  getAuthorizationRequests: (memberId?: string) => AuthorizationRequest[];
  createAuthorizationRequest: (memberId: string, coachId: string, reason: string) => void;
  handleAuthorizationRequest: (requestId: string, action: 'approve' | 'reject', expireAt?: string) => void;

  getOverviewStats: () => typeof mockOverviewStats;
  getCoachStats: () => typeof mockCoachStats;
  getCourseStats: () => typeof mockCourseStats;
}

export const useAppStore = create<AppState>((set, get) => ({
  currentUser: null,
  currentMemberId: null,

  coaches: mockCoaches,
  members: mockMembers,
  measurements: mockMeasurements,
  goals: mockGoals,
  authorizationRequests: mockAuthorizationRequests,
  courses: mockCourses,

  login: (role: UserRole, username: string, _password: string) => {
    if (role === 'coach') {
      const coach = mockCoaches.find((c) => c.username === username);
      if (coach) {
        set({ currentUser: coach });
        return true;
      }
    } else if (role === 'member') {
      const member = mockMembers.find((m) => m.username === username);
      if (member) {
        set({ currentUser: member, currentMemberId: member.id });
        return true;
      }
    } else if (role === 'admin') {
      if (username === 'admin') {
        set({
          currentUser: {
            id: 'admin-1',
            username: 'admin',
            name: '管理员',
            role: 'admin',
            createdAt: '2024-01-01',
          },
        });
        return true;
      }
    }
    return false;
  },

  logout: () => {
    set({ currentUser: null, currentMemberId: null });
  },

  setCurrentMemberId: (id) => set({ currentMemberId: id }),

  getMemberMeasurements: (memberId) => {
    return get().measurements[memberId] || [];
  },

  getLatestMeasurement: (memberId) => {
    const measurements = get().measurements[memberId];
    if (!measurements || measurements.length === 0) return null;
    return measurements[measurements.length - 1];
  },

  getMemberGoals: (memberId) => {
    return get().goals.filter((g) => g.memberId === memberId);
  },

  getTrendData: (memberId, metric) => {
    return getTrendData(memberId, metric);
  },

  getHealthAlerts: () => mockHealthAlerts,

  addMeasurement: (memberId, measurement) => {
    const newMeasurement: Measurement = {
      ...measurement,
      id: Math.random().toString(36).substring(2, 10),
      memberId,
    };
    set((state) => ({
      measurements: {
        ...state.measurements,
        [memberId]: [...(state.measurements[memberId] || []), newMeasurement],
      },
    }));
  },

  addGoal: (goal) => {
    const newGoal: Goal = {
      ...goal,
      id: Math.random().toString(36).substring(2, 10),
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      goals: [...state.goals, newGoal],
    }));
  },

  getAuthorizationRequests: (memberId?) => {
    const requests = get().authorizationRequests;
    if (memberId) {
      return requests.filter((r) => r.memberId === memberId);
    }
    return requests;
  },

  createAuthorizationRequest: (memberId, coachId, reason) => {
    const member = get().members.find((m) => m.id === memberId);
    const coach = get().coaches.find((c) => c.id === coachId);

    const newRequest: AuthorizationRequest = {
      id: Math.random().toString(36).substring(2, 10),
      memberId,
      memberName: member?.name || '',
      coachId,
      coachName: coach?.name || '',
      reason,
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0],
    };
    set((state) => ({
      authorizationRequests: [...state.authorizationRequests, newRequest],
    }));
  },

  handleAuthorizationRequest: (requestId, action, expireAt?) => {
    set((state) => ({
      authorizationRequests: state.authorizationRequests.map((r) =>
        r.id === requestId
          ? { ...r, status: action === 'approve' ? 'approved' : 'rejected', expireAt }
          : r
      ),
    }));
  },

  getOverviewStats: () => mockOverviewStats,
  getCoachStats: () => mockCoachStats,
  getCourseStats: () => mockCourseStats,
}));
