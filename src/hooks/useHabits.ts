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
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setHabits([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToHabits(user.uid, (data) => {
      setHabits(data);
      setLoading(false);
    });

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
