'use client';

import { useEffect, useMemo, useState } from 'react';
import { useHabits } from '@/hooks/useHabits';
import { useAuth } from '@/hooks/useAuth';
import { subscribeToHabitRecords } from '@/lib/firestore';
import { exportJSON, exportCSV } from '@/lib/export';
import { useToast } from '@/components/ui/Toaster';
import WeeklyGrid from '@/components/stats/WeeklyGrid';
import MonthlyCalendar from '@/components/stats/MonthlyCalendar';
import RateBarChart from '@/components/stats/RateBarChart';
import {
  getWeekDayCells,
  getWeeklyRates,
  getMonthlyRates,
} from '@/utils/statsUtils';
import { getThisWeekDates } from '@/utils/dateUtils';

export default function StatsPage() {
  const { user } = useAuth();
  const { habits, loading: habitsLoading } = useHabits();
  const addToast = useToast();

  const activeHabits = useMemo(() => habits.filter((h) => h.isActive), [habits]);

  const [userSelectedId, setUserSelectedId] = useState<string>('');
  const selectedId = userSelectedId || activeHabits[0]?.id || '';

  const [exportingJSON, setExportingJSON] = useState(false);
  const [exportingCSV, setExportingCSV] = useState(false);

  const handleExportJSON = async () => {
    if (!user) return;
    setExportingJSON(true);
    try {
      await exportJSON(user.uid);
      addToast('JSONファイルをダウンロードしました', 'success');
    } catch {
      addToast('エクスポートに失敗しました');
    } finally {
      setExportingJSON(false);
    }
  };

  const handleExportCSV = async () => {
    if (!user) return;
    setExportingCSV(true);
    try {
      await exportCSV(user.uid);
      addToast('CSVファイルをダウンロードしました', 'success');
    } catch {
      addToast('エクスポートに失敗しました');
    } finally {
      setExportingCSV(false);
    }
  };

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

  const weekDates = useMemo(() => getThisWeekDates(), []);

  const weeklyCells = useMemo(
    () => selectedHabit ? getWeekDayCells(selectedHabit, recordMap, weekDates) : [],
    [selectedHabit, recordMap, weekDates]
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
                    <h2 className="text-sm font-semibold text-slate-300">達成カレンダー</h2>
                    <MonthlyCalendar
                      habit={selectedHabit}
                      recordMap={recordMap}
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

        {/* データエクスポート */}
        <section className="space-y-4 rounded-xl border border-slate-700 bg-slate-800 p-5">
          <h2 className="text-sm font-semibold text-slate-200">データエクスポート</h2>
          <p className="text-xs text-slate-400">
            習慣と記録をまとめてダウンロードできます。AIに貼り付けて習慣をレビューしてもらいましょう。
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={handleExportJSON}
              disabled={exportingJSON || !user}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportingJSON ? 'エクスポート中...' : 'JSONでエクスポート'}
            </button>
            <button
              onClick={handleExportCSV}
              disabled={exportingCSV || !user}
              className="rounded-lg bg-slate-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {exportingCSV ? 'エクスポート中...' : 'CSVでエクスポート'}
            </button>
          </div>

          {/* AIレビュー手順 */}
          <div className="mt-2 space-y-3 border-t border-slate-700 pt-4">
            <h3 className="text-xs font-semibold text-slate-300">AIにレビューしてもらう手順</h3>
            <ol className="list-decimal space-y-1 pl-4 text-xs text-slate-400">
              <li>上のボタンからデータをダウンロードする</li>
              <li>Claude・ChatGPT などのAIチャットを開く</li>
              <li>ダウンロードしたファイルの内容を貼り付け、下のプロンプト例を添えて送信する</li>
            </ol>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-300">プロンプト例（JSON）</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-300">
{`以下は私の習慣記録のJSONデータです。各習慣の達成傾向や改善点をレビューし、継続のアドバイスをしてください。

{ここにJSONの内容を貼り付け}`}
              </pre>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-slate-300">プロンプト例（CSV）</p>
              <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-slate-300">
{`以下は私の習慣記録のCSVデータです。達成率の傾向・曜日ごとの特徴・改善点を分析してください。

{ここにCSVの内容を貼り付け}`}
              </pre>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
