import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import {
  subscribeToHabits,
  addHabit,
  updateHabit,
  deleteHabit,
} from '@/lib/firestore';
import type { Habit } from '@/types';

export const useHabits = () => {
  const { user } = useAuth();
  const [_habits, setHabits] = useState<Habit[]>([]);
  const [_loading, setLoading] = useState(true);

  const habits = user ? _habits : [];
  const loading = user ? _loading : false;

  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const unsubscribe = subscribeToHabits(
      user.uid,
      (data) => { setHabits(data); setLoading(false); },
      () => { setLoading(false); }
    );

    return () => unsubscribe();
  }, [user]);

  const add = (data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) return Promise.reject(new Error('Not authenticated'));
    return addHabit(user.uid, data);
  };

  const update = (
    habitId: string,
    data: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>
  ) => {
    if (!user) return Promise.reject(new Error('Not authenticated'));
    return updateHabit(user.uid, habitId, data);
  };

  const remove = (habitId: string) => {
    if (!user) return Promise.reject(new Error('Not authenticated'));
    return deleteHabit(user.uid, habitId);
  };

  return { habits, loading, add, update, remove };
};
