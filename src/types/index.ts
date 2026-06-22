export type UserRole = 'coach' | 'member' | 'admin';

export interface User {
  id: string;
  username: string;
  name: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
}

export interface Member extends User {
  gender?: 'male' | 'female';
  age?: number;
  height?: number;
  courseId?: string;
  courseName?: string;
  primaryCoachId?: string;
  primaryCoachName?: string;
  joinDate?: string;
}

export interface Coach extends User {
  specialty?: string;
  bio?: string;
  memberCount?: number;
}

export interface Measurement {
  id: string;
  memberId: string;
  coachId: string;
  coachName: string;
  measuredAt: string;

  weight?: number;
  bodyFatRate?: number;
  bmi?: number;

  waist?: number;
  hip?: number;
  chest?: number;
  arm?: number;
  thigh?: number;

  benchPress?: number;
  squat?: number;
  deadlift?: number;

  notes?: string;
}

export interface Goal {
  id: string;
  memberId: string;
  type: 'weight' | 'bodyFat' | 'strength' | 'custom';
  name: string;
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  status: 'active' | 'completed' | 'expired';
  createdAt: string;
}

export interface AuthorizationRequest {
  id: string;
  memberId: string;
  memberName: string;
  coachId: string;
  coachName: string;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  expireAt?: string;
  createdAt: string;
}

export interface Course {
  id: string;
  name: string;
  coachId: string;
  coachName: string;
  description?: string;
  memberCount: number;
  avgImprovement?: number;
}

export interface TrendPoint {
  date: string;
  value: number;
}

export interface HealthAlert {
  id: string;
  type: 'warning' | 'info';
  metric: string;
  value: number;
  reference: string;
  message: string;
}

export interface CoachStats {
  coachId: string;
  coachName: string;
  memberCount: number;
  avgWeightChange: number;
  avgBodyFatChange: number;
  avgStrengthChange: number;
}

export interface CourseStats {
  courseId: string;
  courseName: string;
  memberCount: number;
  avgImprovement: number;
  completionRate: number;
}

export interface OverviewStats {
  totalMembers: number;
  totalCoaches: number;
  totalMeasurements: number;
  avgImprovementRate: number;
  activeGoals: number;
}

export type MetricType = 'weight' | 'bodyFatRate' | 'bmi' | 'waist' | 'hip' | 'chest' | 'arm' | 'thigh' | 'benchPress' | 'squat' | 'deadlift';

export const METRIC_LABELS: Record<MetricType, string> = {
  weight: '体重',
  bodyFatRate: '体脂率',
  bmi: 'BMI',
  waist: '腰围',
  hip: '臀围',
  chest: '胸围',
  arm: '臂围',
  thigh: '大腿围',
  benchPress: '卧推',
  squat: '深蹲',
  deadlift: '硬拉',
};

export const METRIC_UNITS: Record<MetricType, string> = {
  weight: 'kg',
  bodyFatRate: '%',
  bmi: '',
  waist: 'cm',
  hip: 'cm',
  chest: 'cm',
  arm: 'cm',
  thigh: 'cm',
  benchPress: 'kg',
  squat: 'kg',
  deadlift: 'kg',
};
