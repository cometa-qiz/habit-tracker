import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { subscribeToRecords, toggleRecord } from '@/lib/firestore';
import type { Record as HabitRecord } from '@/types';

export const useRecords = (date: string) => {
  const { user } = useAuth();
  // habitId → HabitRecord のマップで保持（存在チェック・completed参照を O(1) に）
  const [records, setRecords] = useState<Map<string, HabitRecord>>(new Map());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setRecords(new Map());
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToRecords(user.uid, date, (data) => {
      const map = new Map(data.map((r) => [r.habitId, r]));
      setRecords(map);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, date]);

  const toggle = (habitId: string) => {
    if (!user) return Promise.reject(new Error('Not authenticated'));
    const current = records.get(habitId);
    return toggleRecord(user.uid, habitId, date, current?.completed ?? false);
  };

  return { records, loading, toggle };
};
