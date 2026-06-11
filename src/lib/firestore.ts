'use client';

import {
  collection,
  doc,
  addDoc,
  setDoc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp,
  type Unsubscribe,
} from 'firebase/firestore';
import { db } from './firebase';
import type { Habit, Record as HabitRecord } from '@/types';

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

// ── records ──────────────────────────────────────────────

const recordsCol = (userId: string) =>
  collection(db, 'users', userId, 'records');

export const subscribeToRecords = (
  userId: string,
  date: string,
  callback: (records: HabitRecord[]) => void
): Unsubscribe => {
  const q = query(recordsCol(userId), where('date', '==', date));
  return onSnapshot(q, (snapshot) => {
    const records = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as HabitRecord[];
    callback(records);
  });
};

export const toggleRecord = async (
  userId: string,
  habitId: string,
  date: string,
  currentCompleted: boolean
): Promise<void> => {
  const recordId = `${date}_${habitId}`;
  const ref = doc(db, 'users', userId, 'records', recordId);
  const newCompleted = !currentCompleted;
  await setDoc(ref, {
    id: recordId,
    habitId,
    date,
    completed: newCompleted,
    completedAt: newCompleted ? serverTimestamp() : null,
  });
};
