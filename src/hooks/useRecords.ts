import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { subscribeToRecords, toggleRecord } from '@/lib/firestore';
import type { Record as HabitRecord } from '@/types';

export const useRecords = (date: string) => {
  const { user } = useAuth();
  // habitId → HabitRecord のマップで保持（存在チェック・completed参照を O(1) に）
  const [_records, setRecords] = useState<Map<string, HabitRecord>>(new Map());
  const [_loading, setLoading] = useState(true);

  const records = user ? _records : new Map<string, HabitRecord>();
  const loading = user ? _loading : false;

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = subscribeToRecords(
      user.uid,
      date,
      (data) => { setRecords(new Map(data.map((r) => [r.habitId, r]))); setLoading(false); },
      () => { setLoading(false); }
    );

    return () => unsubscribe();
  }, [user, date]);

  const toggle = (habitId: string) => {
    if (!user) return Promise.reject(new Error('Not authenticated'));
    const current = records.get(habitId);
    return toggleRecord(user.uid, habitId, date, current?.completed ?? false);
  };

  return { records, loading, toggle };
};
