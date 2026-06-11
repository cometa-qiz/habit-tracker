'use client';

import Link from 'next/link';
import HabitList from '@/components/habits/HabitList';
import { useHabits } from '@/hooks/useHabits';

export default function HabitsPage() {
  const { habits, loading, remove } = useHabits();

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="mx-auto max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-white">習慣の管理</h1>
          <Link
            href="/habits/new"
            className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors"
          >
            ＋ 追加
          </Link>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500" />
          </div>
        ) : (
          <HabitList habits={habits} onDelete={remove} />
        )}
      </div>
    </div>
  );
}
