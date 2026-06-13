'use client';

import { useMemo } from 'react';
import HabitCard from '@/components/habits/HabitCard';
import ProgressBar from '@/components/ui/ProgressBar';
import { useAuth } from '@/hooks/useAuth';
import { useHabits } from '@/hooks/useHabits';
import { useRecords } from '@/hooks/useRecords';
import { updateSummary } from '@/lib/summary';
import { useToast } from '@/components/ui/Toaster';
import { getTodayString, getDayOfWeek } from '@/utils/dateUtils';
import { calcRate } from '@/utils/statsUtils';

export default function Home() {
  const { user } = useAuth();
  const toast = useToast();
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

  const handleToggle = (habitId: string) => {
    const currentCompleted = records.get(habitId)?.completed ?? false;
    toggle(habitId).then(() => {
      if (!user) return;
      // トグル後の完了数を楽観的に計算
      const delta = currentCompleted ? -1 : 1;
      const newCompleted = Math.max(0, Math.min(todayHabits.length, completedCount + delta));
      const rate = calcRate(newCompleted, todayHabits.length);
      updateSummary(user.uid, {
        todayTotal: todayHabits.length,
        todayCompleted: newCompleted,
        todayRate: rate,
        // topStreak はカード単位の useStreak に依存するため今週実績で代替
        topStreak: { habitName: '', emoji: '', days: 0 },
        weeklyRate: rate,
      }).catch(() => undefined);
    }).catch(() => {
      toast('チェックの更新に失敗しました。再度お試しください。');
    });
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 pt-6 pb-24">
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
                    onToggle={() => handleToggle(habit.id)}
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
