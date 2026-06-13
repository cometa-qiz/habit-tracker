'use client';

import type { DayCell } from '@/utils/statsUtils';

const DAY_LABELS = ['月', '火', '水', '木', '金', '土', '日'];

interface Props {
  cells: DayCell[];
}

export default function WeeklyGrid({ cells }: Props) {
  return (
    <div className="space-y-2">
      {/* 曜日ヘッダー */}
      <div className="grid grid-cols-7 gap-1.5">
        {DAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-center text-xs font-medium text-slate-400"
          >
            {label}
          </div>
        ))}
      </div>

      {/* マス目 */}
      <div className="grid grid-cols-7 gap-1.5">
        {cells.map(({ date, isTarget, completed }) => (
          <div
            key={date}
            title={date}
            aria-label={`${date}: ${!isTarget ? '対象外' : completed ? '達成' : '未達成'}`}
            className={`aspect-square rounded-md transition-colors ${
              !isTarget
                ? 'bg-slate-800/40'
                : completed
                ? 'bg-indigo-500'
                : 'bg-slate-700'
            }`}
          />
        ))}
      </div>

      {/* 凡例 */}
      <div className="flex items-center gap-4 pt-1">
        <LegendItem color="bg-indigo-500" label="達成" />
        <LegendItem color="bg-slate-700" label="未達成" />
        <LegendItem color="bg-slate-800/40" label="対象外" />
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
