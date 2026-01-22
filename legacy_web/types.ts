export enum Screen {
  REGISTER = 'REGISTER',
  NOTIFICATION_SETTINGS = 'NOTIFICATION_SETTINGS',
  HOME = 'HOME',
  LIBRARY = 'LIBRARY',
  ACADEMY = 'ACADEMY',
  COURSE_DETAIL = 'COURSE_DETAIL',
  TRANSITION_TUNNEL = 'TRANSITION_TUNNEL',
  BREATHING_TIMER = 'BREATHING_TIMER',
  SESSION_END = 'SESSION_END',
  COMMUNITY = 'COMMUNITY',
  PROFILE = 'PROFILE',
  WEEKLY_REPORT = 'WEEKLY_REPORT'
}

export interface UserState {
  name: string;
  isRegistered: boolean;
  hasMissedDay: boolean;
  isDailySessionDone: boolean;
  streak: number;
  resilienceScore: number;
  isPlusMember: boolean;
}

export interface Session {
  id: string;
  title: string;
  duration: number; // minutes
  category: string;
  isPlus: boolean;
  image: string;
}

export interface Course {
  id: string;
  title: string;
  author: string;
  duration: string;
  level: string;
  isPlus: boolean;
  progress: number;
  image: string;
}