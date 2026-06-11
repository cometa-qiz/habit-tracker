'use client';

import {
  collection,
  doc,
  addDoc,
  updateDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Habit } from '@/types';

const habitsCol = (userId: string) =>
  collection(db, 'users', userId, 'habits');

export const subscribeToHabits = (
  userId: string,
  callback: (habits: Habit[]) => void
): Unsubscribe => {
  const q = query(habitsCol(userId), orderBy('order', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const habits = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Habit[];
    callback(habits);
  });
};

export const addHabit = async (
  userId: string,
  data: Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<void> => {
  await addDoc(habitsCol(userId), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
};

export const updateHabit = async (
  userId: string,
  habitId: string,
  data: Partial<Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<void> => {
  const ref = doc(db, 'users', userId, 'habits', habitId);
  await updateDoc(ref, {
    ...data,
    updatedAt: serverTimestamp(),
  });
};

export const deleteHabit = async (
  userId: string,
  habitId: string
): Promise<void> => {
  await updateHabit(userId, habitId, { isActive: false });
};
