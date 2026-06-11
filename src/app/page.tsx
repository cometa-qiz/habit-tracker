'use client';

import { useMemo } from 'react';
import HabitCard from '@/components/habits/HabitCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { useHabits } from '@/hooks/useHabits';
import { useRecords } from '@/hooks/useRecords';
import { getTodayString, getDayOfWeek } from '@/utils/dateUtils';

export default function Home() {
  const today = getTodayString();
  const todayDow = getDayOfWeek(today);

  const { habits, loading: habitsLoading } = useHabits();
  const { records, loading: recordsLoading, toggle } = useRecords(today);

  const todayHabits = useMemo(
    () =>
      habits.filter(
        (h) => h.isActive && h.targetDays.includes(todayDow)
      ),
    [habits, todayDow]
  );

  const completedCount = useMemo(
    () => todayHabits.filter((h) => records.get(h.id)?.completed).length,
    [todayHabits, records]
  );

  const loading = habitsLoading || recordsLoading;

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="mx-auto max-w-md space-y-6">
        <h1 className="text-xl font-bold text-white">今日の習慣</h1>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500" />
          </div>
        ) : (
          <>
            <ProgressBar completed={completedCount} total={todayHabits.length} />

            {todayHabits.length === 0 ? (
              <p className="text-center text-slate-400 py-12">
                今日の習慣はありません。
              </p>
            ) : (
              <ul className="space-y-3">
                {todayHabits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    completed={records.get(habit.id)?.completed ?? false}
                    onToggle={() => toggle(habit.id)}
                  />
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
