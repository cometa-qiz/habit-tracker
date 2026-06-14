'use client';

import { useMemo, useState } from 'react';
import HabitCard from '@/components/habits/HabitCard';
import ProgressBar from '@/components/ui/ProgressBar';
import PastDatePicker from '@/components/ui/PastDatePicker';
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

  const [selectedDate, setSelectedDate] = useState(today);
  const isToday = selectedDate === today;
  const selectedDow = getDayOfWeek(selectedDate);

  const { habits, loading: habitsLoading } = useHabits();
  const { records, loading: recordsLoading, toggle } = useRecords(selectedDate);

  const selectedHabits = useMemo(
    () => habits.filter((h) => h.isActive && h.targetDays.includes(selectedDow)),
    [habits, selectedDow]
  );

  const completedCount = useMemo(
    () => selectedHabits.filter((h) => records.get(h.id)?.completed).length,
    [selectedHabits, records]
  );

  const loading = habitsLoading || recordsLoading;

  const handleToggle = (habitId: string) => {
    const currentCompleted = records.get(habitId)?.completed ?? false;
    toggle(habitId).then(() => {
      if (!user || !isToday) return;
      // 今日の記録のみ summary を更新（過去日編集では不要）
      const delta = currentCompleted ? -1 : 1;
      const newCompleted = Math.max(0, Math.min(selectedHabits.length, completedCount + delta));
      const rate = calcRate(newCompleted, selectedHabits.length);
      updateSummary(user.uid, {
        todayTotal: selectedHabits.length,
        todayCompleted: newCompleted,
        todayRate: rate,
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
        <div className="flex items-center justify-between gap-4">
          <h1 className="text-xl font-bold text-white shrink-0">
            {isToday ? '今日の習慣' : '過去の習慣'}
          </h1>
          <PastDatePicker value={selectedDate} onChange={setSelectedDate} />
        </div>

        {!isToday && (
          <div className="rounded-lg border border-amber-700 bg-amber-900/40 px-4 py-2 text-sm text-amber-300">
            過去の記録を編集中（{selectedDate}）
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500" />
          </div>
        ) : (
          <>
            <ProgressBar completed={completedCount} total={selectedHabits.length} />

            {selectedHabits.length === 0 ? (
              <p className="py-12 text-center text-slate-400">
                {isToday ? '今日の習慣はありません。' : 'この日の習慣はありません。'}
              </p>
            ) : (
              <ul className="space-y-3">
                {selectedHabits.map((habit) => (
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
