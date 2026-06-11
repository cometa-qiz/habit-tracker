import type { Timestamp } from 'firebase/firestore';

export interface Habit {
  id: string;
  name: string;
  emoji: string;
  memo: string;
  category: string;
  targetDays: number[];
  isActive: boolean;
  order: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Record {
  id: string;
  habitId: string;
  date: string;
  completed: boolean;
  completedAt: Timestamp | null;
}

export interface Summary {
  todayTotal: number;
  todayCompleted: number;
  todayRate: number;
  topStreak: {
    habitName: string;
    emoji: string;
    days: number;
  };
  weeklyRate: number;
  updatedAt: Timestamp;
}
