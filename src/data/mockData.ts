import type {
  Member,
  Coach,
  Measurement,
  Goal,
  AuthorizationRequest,
  Course,
  HealthAlert,
  TrendPoint,
  OverviewStats,
  CoachStats,
  CourseStats,
} from '@/types';

const generateId = () => Math.random().toString(36).substring(2, 10);

export const mockCoaches: Coach[] = [
  {
    id: 'coach-1',
    username: 'coach_zhang',
    name: '张教练',
    role: 'coach',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhang',
    createdAt: '2024-01-15',
    specialty: '减脂塑形',
    bio: '8年健身教练经验，擅长减脂塑形和力量训练',
    memberCount: 32,
  },
  {
    id: 'coach-2',
    username: 'coach_li',
    name: '李教练',
    role: 'coach',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=li',
    createdAt: '2024-03-20',
    specialty: '力量举',
    bio: '国家一级运动员，专注力量举训练',
    memberCount: 25,
  },
  {
    id: 'coach-3',
    username: 'coach_wang',
    name: '王教练',
    role: 'coach',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wang',
    createdAt: '2024-06-10',
    specialty: '功能性训练',
    bio: 'ACE认证教练，擅长功能性训练和康复训练',
    memberCount: 18,
  },
];

export const mockMembers: Member[] = [
  {
    id: 'member-1',
    username: 'chen_wei',
    name: '陈伟',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenwei',
    createdAt: '2024-08-01',
    gender: 'male',
    age: 28,
    height: 178,
    courseId: 'course-1',
    courseName: '减脂塑形班',
    primaryCoachId: 'coach-1',
    primaryCoachName: '张教练',
    joinDate: '2024-08-01',
  },
  {
    id: 'member-2',
    username: 'liu_fang',
    name: '刘芳',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=liufang',
    createdAt: '2024-09-15',
    gender: 'female',
    age: 32,
    height: 165,
    courseId: 'course-1',
    courseName: '减脂塑形班',
    primaryCoachId: 'coach-1',
    primaryCoachName: '张教练',
    joinDate: '2024-09-15',
  },
  {
    id: 'member-3',
    username: 'wang_qiang',
    name: '王强',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangqiang',
    createdAt: '2024-10-01',
    gender: 'male',
    age: 35,
    height: 182,
    courseId: 'course-2',
    courseName: '力量举进阶班',
    primaryCoachId: 'coach-2',
    primaryCoachName: '李教练',
    joinDate: '2024-10-01',
  },
  {
    id: 'member-4',
    username: 'zhao_min',
    name: '赵敏',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhaomin',
    createdAt: '2024-11-01',
    gender: 'female',
    age: 26,
    height: 168,
    courseId: 'course-3',
    courseName: '功能性训练班',
    primaryCoachId: 'coach-3',
    primaryCoachName: '王教练',
    joinDate: '2024-11-01',
  },
  {
    id: 'member-5',
    username: 'sun_lei',
    name: '孙磊',
    role: 'member',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunlei',
    createdAt: '2024-11-15',
    gender: 'male',
    age: 30,
    height: 175,
    courseId: 'course-2',
    courseName: '力量举进阶班',
    primaryCoachId: 'coach-2',
    primaryCoachName: '李教练',
    joinDate: '2024-11-15',
  },
];

const generateMeasurements = (memberId: string, baseWeight: number, baseBodyFat: number, months: number): Measurement[] => {
  const measurements: Measurement[] = [];
  const now = new Date();
  let weight = baseWeight;
  let bodyFat = baseBodyFat;

  for (let i = months; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    date.setDate(Math.floor(Math.random() * 28) + 1);

    weight += (Math.random() - 0.7) * 0.8;
    bodyFat += (Math.random() - 0.65) * 0.5;

    const bmi = weight / Math.pow(1.75, 2);

    measurements.push({
      id: generateId(),
      memberId,
      coachId: 'coach-1',
      coachName: '张教练',
      measuredAt: date.toISOString().split('T')[0],
      weight: Math.round(weight * 10) / 10,
      bodyFatRate: Math.round(bodyFat * 10) / 10,
      bmi: Math.round(bmi * 10) / 10,
      waist: Math.round((80 + Math.random() * 15) * 10) / 10,
      hip: Math.round((90 + Math.random() * 15) * 10) / 10,
      chest: Math.round((95 + Math.random() * 15) * 10) / 10,
      arm: Math.round((28 + Math.random() * 8) * 10) / 10,
      thigh: Math.round((50 + Math.random() * 10) * 10) / 10,
      benchPress: Math.round((50 + (months - i) * 3 + Math.random() * 10) * 10) / 10,
      squat: Math.round((70 + (months - i) * 4 + Math.random() * 15) * 10) / 10,
      deadlift: Math.round((90 + (months - i) * 5 + Math.random() * 20) * 10) / 10,
    });
  }

  return measurements;
};

export const mockMeasurements: Record<string, Measurement[]> = {
  'member-1': generateMeasurements('member-1', 85, 25, 6),
  'member-2': generateMeasurements('member-2', 65, 30, 5),
  'member-3': generateMeasurements('member-3', 90, 18, 4),
  'member-4': generateMeasurements('member-4', 58, 24, 3),
  'member-5': generateMeasurements('member-5', 80, 20, 2),
};

export const mockGoals: Goal[] = [
  {
    id: 'goal-1',
    memberId: 'member-1',
    type: 'weight',
    name: '减重目标',
    targetValue: 75,
    currentValue: 80.5,
    unit: 'kg',
    deadline: '2025-06-30',
    status: 'active',
    createdAt: '2024-12-01',
  },
  {
    id: 'goal-2',
    memberId: 'member-1',
    type: 'bodyFat',
    name: '体脂率目标',
    targetValue: 18,
    currentValue: 22.3,
    unit: '%',
    deadline: '2025-06-30',
    status: 'active',
    createdAt: '2024-12-01',
  },
  {
    id: 'goal-3',
    memberId: 'member-1',
    type: 'strength',
    name: '卧推目标',
    targetValue: 100,
    currentValue: 72,
    unit: 'kg',
    deadline: '2025-12-31',
    status: 'active',
    createdAt: '2025-01-01',
  },
  {
    id: 'goal-4',
    memberId: 'member-2',
    type: 'weight',
    name: '减重目标',
    targetValue: 55,
    currentValue: 60.2,
    unit: 'kg',
    deadline: '2025-08-31',
    status: 'active',
    createdAt: '2024-12-15',
  },
];

export const mockAuthorizationRequests: AuthorizationRequest[] = [
  {
    id: 'auth-1',
    memberId: 'member-1',
    memberName: '陈伟',
    coachId: 'coach-2',
    coachName: '李教练',
    reason: '需要了解会员身体状况以辅助力量训练指导',
    status: 'pending',
    createdAt: '2025-01-10',
  },
  {
    id: 'auth-2',
    memberId: 'member-1',
    memberName: '陈伟',
    coachId: 'coach-3',
    coachName: '王教练',
    reason: '功能性训练课程需要参考体测数据',
    status: 'approved',
    expireAt: '2025-06-30',
    createdAt: '2024-12-15',
  },
];

export const mockCourses: Course[] = [
  {
    id: 'course-1',
    name: '减脂塑形班',
    coachId: 'coach-1',
    coachName: '张教练',
    description: '针对减脂塑形需求的系统化训练课程',
    memberCount: 32,
    avgImprovement: 12.5,
  },
  {
    id: 'course-2',
    name: '力量举进阶班',
    coachId: 'coach-2',
    coachName: '李教练',
    description: '专注三大项力量提升的专业训练课程',
    memberCount: 25,
    avgImprovement: 18.3,
  },
  {
    id: 'course-3',
    name: '功能性训练班',
    coachId: 'coach-3',
    coachName: '王教练',
    description: '提升身体功能和运动表现的综合训练',
    memberCount: 18,
    avgImprovement: 8.7,
  },
];

export const mockHealthAlerts: HealthAlert[] = [
  {
    id: 'alert-1',
    type: 'warning',
    metric: '体脂率',
    value: 22.3,
    reference: '18-20%',
    message: '您的体脂率略高于健康参考范围，建议继续保持规律运动和合理饮食',
  },
  {
    id: 'alert-2',
    type: 'info',
    metric: 'BMI',
    value: 24.8,
    reference: '18.5-23.9',
    message: '您的BMI接近正常范围上限，请注意控制体重在健康范围内',
  },
];

export const getTrendData = (memberId: string, metric: string): TrendPoint[] => {
  const measurements = mockMeasurements[memberId] || [];
  return measurements.map((m) => ({
    date: m.measuredAt,
    value: ((m as unknown) as Record<string, number | string | undefined>)[metric] as number || 0,
  }));
};

export const mockOverviewStats: OverviewStats = {
  totalMembers: 75,
  totalCoaches: 8,
  totalMeasurements: 520,
  avgImprovementRate: 11.2,
  activeGoals: 156,
};

export const mockCoachStats: CoachStats[] = [
  {
    coachId: 'coach-1',
    coachName: '张教练',
    memberCount: 32,
    avgWeightChange: -4.2,
    avgBodyFatChange: -3.8,
    avgStrengthChange: 15.6,
  },
  {
    coachId: 'coach-2',
    coachName: '李教练',
    memberCount: 25,
    avgWeightChange: 0.8,
    avgBodyFatChange: -1.2,
    avgStrengthChange: 22.3,
  },
  {
    coachId: 'coach-3',
    coachName: '王教练',
    memberCount: 18,
    avgWeightChange: -2.1,
    avgBodyFatChange: -2.5,
    avgStrengthChange: 10.8,
  },
];

export const mockCourseStats: CourseStats[] = [
  {
    courseId: 'course-1',
    courseName: '减脂塑形班',
    memberCount: 32,
    avgImprovement: 12.5,
    completionRate: 85,
  },
  {
    courseId: 'course-2',
    courseName: '力量举进阶班',
    memberCount: 25,
    avgImprovement: 18.3,
    completionRate: 92,
  },
  {
    courseId: 'course-3',
    courseName: '功能性训练班',
    memberCount: 18,
    avgImprovement: 8.7,
    completionRate: 78,
  },
];
