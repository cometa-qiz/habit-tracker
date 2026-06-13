'use client';

import { useEffect, useMemo, useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToHabitRecords } from '@/lib/firestore';
import WeeklyGrid from '@/components/stats/WeeklyGrid';
import MonthlyCalendar from '@/components/stats/MonthlyCalendar';
import RateBarChart from '@/components/stats/RateBarChart';
import {
  getWeekDayCells,
  getMonthDayCells,
  getMonthStartPadding,
  getWeeklyRates,
  getMonthlyRates,
} from '@/utils/statsUtils';
import { getThisWeekDates } from '@/utils/dateUtils';

export default function StatsPage() {
  const { user } = useAuth();
  const { habits, loading: habitsLoading } = useHabits();

  const activeHabits = useMemo(() => habits.filter((h) => h.isActive), [habits]);

  // ユーザーが明示的に選択した habitId（'' のときは先頭を使う）
  const [userSelectedId, setUserSelectedId] = useState<string>('');
  const selectedId = userSelectedId || activeHabits[0]?.id || '';

  const [recordMap, setRecordMap] = useState<Map<string, boolean>>(new Map());

  // 選択習慣のレコードを購読（setState はコールバック内のみ）
  useEffect(() => {
    if (!user || !selectedId) return;
    const unsubscribe = subscribeToHabitRecords(user.uid, selectedId, (records) => {
      setRecordMap(new Map(records.map((r) => [r.date, r.completed])));
    });
    return () => unsubscribe();
  }, [user, selectedId]);

  const selectedHabit = useMemo(
    () => activeHabits.find((h) => h.id === selectedId) ?? null,
    [activeHabits, selectedId]
  );

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;

  const weekDates = useMemo(() => getThisWeekDates(), []);
  const startPadding = useMemo(() => getMonthStartPadding(year, month), [year, month]);

  const weeklyCells = useMemo(
    () => selectedHabit ? getWeekDayCells(selectedHabit, recordMap, weekDates) : [],
    [selectedHabit, recordMap, weekDates]
  );
  const monthlyCells = useMemo(
    () => selectedHabit ? getMonthDayCells(selectedHabit, recordMap, year, month) : [],
    [selectedHabit, recordMap, year, month]
  );
  const weeklyRates = useMemo(
    () => selectedHabit ? getWeeklyRates(selectedHabit, recordMap) : [],
    [selectedHabit, recordMap]
  );
  const monthlyRates = useMemo(
    () => selectedHabit ? getMonthlyRates(selectedHabit, recordMap) : [],
    [selectedHabit, recordMap]
  );

  if (habitsLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8 pb-24 md:pb-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <h1 className="text-xl font-bold text-white">統計</h1>

        {activeHabits.length === 0 ? (
          <p className="py-12 text-center text-slate-400">習慣が登録されていません。</p>
        ) : (
          <>
            {/* 習慣フィルター */}
            <div>
              <label
                htmlFor="habit-select"
                className="mb-1.5 block text-sm font-medium text-slate-400"
              >
                習慣を選択
              </label>
              <select
                id="habit-select"
                value={selectedId}
                onChange={(e) => setUserSelectedId(e.target.value)}
                className="w-full rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {activeHabits.map((h) => (
                  <option key={h.id} value={h.id}>
                    {h.emoji} {h.name}
                  </option>
                ))}
              </select>
            </div>

            {selectedHabit && (
              <>
                {/* md 以上で WeeklyGrid と MonthlyCalendar を横並び */}
                <div className="grid gap-6 md:grid-cols-2">
                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-300">今週の達成状況</h2>
                    <WeeklyGrid cells={weeklyCells} />
                  </section>

                  <section className="space-y-3">
                    <h2 className="text-sm font-semibold text-slate-300">今月の達成カレンダー</h2>
                    <MonthlyCalendar
                      cells={monthlyCells}
                      startPadding={startPadding}
                      year={year}
                      month={month}
                    />
                  </section>
                </div>

                <section className="space-y-3">
                  <h2 className="text-sm font-semibold text-slate-300">達成率グラフ</h2>
                  <RateBarChart weekEntries={weeklyRates} monthEntries={monthlyRates} />
                </section>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
