'use client';

import { useMemo, useState } from 'react';
import type { Habit } from '@/types';
import { getMonthDayCells, getMonthStartPadding } from '@/utils/statsUtils';

const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

interface Props {
  habit: Habit;
  recordMap: Map<string, boolean>;
}

export default function MonthlyCalendar({ habit, recordMap }: Props) {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth() + 1;

  const [viewMonth, setViewMonth] = useState<{ year: number; month: number }>({
    year: currentYear,
    month: currentMonth,
  });

  const isCurrentMonth =
    viewMonth.year === currentYear && viewMonth.month === currentMonth;

  const cells = useMemo(
    () => getMonthDayCells(habit, recordMap, viewMonth.year, viewMonth.month),
    [habit, recordMap, viewMonth]
  );
  const startPadding = useMemo(
    () => getMonthStartPadding(viewMonth.year, viewMonth.month),
    [viewMonth]
  );

  const goPrev = () => {
    setViewMonth(({ year, month }) =>
      month === 1 ? { year: year - 1, month: 12 } : { year, month: month - 1 }
    );
  };

  const goNext = () => {
    if (isCurrentMonth) return;
    setViewMonth(({ year, month }) =>
      month === 12 ? { year: year + 1, month: 1 } : { year, month: month + 1 }
    );
  };

  return (
    <div className="space-y-2">
      {/* 年月ヘッダーとナビゲーション */}
      <div className="flex items-center justify-between">
        <button
          onClick={goPrev}
          className="rounded px-2 py-1 text-sm text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          aria-label="前月"
        >
          &lt; 前月
        </button>
        <p className="text-sm font-semibold text-slate-300">
          {viewMonth.year}年 {viewMonth.month}月
        </p>
        <button
          onClick={goNext}
          disabled={isCurrentMonth}
          className={`rounded px-2 py-1 text-sm transition-colors ${
            isCurrentMonth
              ? 'cursor-not-allowed text-slate-600'
              : 'text-slate-400 hover:bg-slate-700 hover:text-white'
          }`}
          aria-label="翌月"
        >
          翌月 &gt;
        </button>
      </div>

      {/* 曜日ラベル */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <div key={label} className="text-center text-xs font-medium text-slate-400">
            {label}
          </div>
        ))}
      </div>

      {/* カレンダーマス目 */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: startPadding }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}
        {cells.map(({ date, isTarget, completed }) => {
          const day = Number(date.slice(-2));
          return (
            <div
              key={date}
              title={date}
              aria-label={`${date}: ${!isTarget ? '対象外' : completed ? '達成' : '未達成'}`}
              className={`flex aspect-square items-center justify-center rounded-md text-xs transition-colors ${
                !isTarget
                  ? 'text-slate-600'
                  : completed
                  ? 'bg-indigo-500 font-semibold text-white'
                  : 'bg-slate-700 text-slate-400'
              }`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 pt-1">
        <LegendItem color="bg-indigo-500" label="達成" />
        <LegendItem color="bg-slate-700" label="未達成" />
        <span className="text-xs text-slate-600">数字のみ = 対象外</span>
      </div>
    </div>
  );
}

function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className={`h-3 w-3 rounded-sm ${color}`} />
      <span className="text-xs text-slate-400">{label}</span>
    </div>
  );
}
