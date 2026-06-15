'use client';

import { getTodayString, getDayOfWeek } from '@/utils/dateUtils';

type Props = {
  value: string;
  onChange: (date: string) => void;
};

const WEEKDAY_LABELS = ['日', '月', '火', '水', '木', '金', '土'];

function formatWithWeekday(value: string): string {
  if (!value) return '';
  const [y, m, d] = value.split('-');
  return `${y}/${m}/${d} (${WEEKDAY_LABELS[getDayOfWeek(value)]})`;
}

export default function PastDatePicker({ value, onChange }: Props) {
  return (
    <div className="relative inline-flex items-center rounded-md border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white shadow-sm">
      <span>{formatWithWeekday(value)}</span>
      <input
        type="date"
        value={value}
        max={getTodayString()}
        onChange={(e) => onChange(e.target.value)}
        onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()}
        aria-label="日付を選択"
        className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
      />
    </div>
  );
}
