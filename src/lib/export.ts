'use client';

import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import type { Habit, Record as HabitRecord } from '@/types';

const fetchHabits = async (userId: string): Promise<Habit[]> => {
  const col = collection(db, 'users', userId, 'habits');
  const snap = await getDocs(query(col, orderBy('order', 'asc')));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Habit));
};

const fetchRecords = async (userId: string): Promise<HabitRecord[]> => {
  const col = collection(db, 'users', userId, 'records');
  const snap = await getDocs(col);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as HabitRecord));
};

const triggerDownload = (blob: Blob, filename: string): void => {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
};

const dateTag = () => new Date().toISOString().slice(0, 10);

export const exportJSON = async (userId: string): Promise<void> => {
  const [habits, records] = await Promise.all([fetchHabits(userId), fetchRecords(userId)]);

  const data = {
    exportedAt: new Date().toISOString(),
    habits: habits.map((h) => ({
      ...h,
      createdAt: h.createdAt?.toDate?.()?.toISOString() ?? null,
      updatedAt: h.updatedAt?.toDate?.()?.toISOString() ?? null,
    })),
    records: records
      .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
      .map((r) => ({
        ...r,
        completedAt: r.completedAt?.toDate?.()?.toISOString() ?? null,
      })),
  };

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  triggerDownload(blob, `habit-tracker-${dateTag()}.json`);
};

export const exportCSV = async (userId: string): Promise<void> => {
  const [habits, records] = await Promise.all([fetchHabits(userId), fetchRecords(userId)]);

  const habitMap = new Map(habits.map((h) => [h.id, h]));
  const escape = (s: string) => `"${s.replace(/"/g, '""')}"`;

  const header = 'habitId,habitName,date,completed';
  const rows = records
    .sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0))
    .map((r) => {
      const name = habitMap.get(r.habitId)?.name ?? '';
      return `${r.habitId},${escape(name)},${r.date},${r.completed}`;
    });

  const csv = [header, ...rows].join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, `habit-tracker-${dateTag()}.csv`);
};
