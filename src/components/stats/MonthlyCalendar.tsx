'use client';

import type { DayCell } from '@/utils/statsUtils';

const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

interface Props {
  cells: DayCell[];
  /** getMonthStartPadding() の戻り値（月曜始まりの先頭空白数） */
  startPadding: number;
  year: number;
  month: number;
}

export default function MonthlyCalendar({ cells, startPadding, year, month }: Props) {
  return (
    <div className="space-y-2">
      {/* 年月ヘッダー */}
      <p className="text-sm font-semibold text-slate-300">
        {year}年 {month}月
      </p>

      {/* 曜日ラベル */}
      <div className="grid grid-cols-7 gap-1">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-slate-400"
          >
            {label}
          </div>
        ))}
      </div>

      {/* カレンダーマス目 */}
      <div className="grid grid-cols-7 gap-1">
        {/* 先頭の空白セル */}
        {Array.from({ length: startPadding }, (_, i) => (
          <div key={`pad-${i}`} />
        ))}

        {/* 日付セル */}
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
