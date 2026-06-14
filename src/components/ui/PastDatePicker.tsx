'use client';

import { getTodayString } from '@/utils/dateUtils';

type Props = {
  value: string;
  onChange: (date: string) => void;
};

export default function PastDatePicker({ value, onChange }: Props) {
  return (
    <input
      type="date"
      value={value}
      max={getTodayString()}
      onChange={(e) => onChange(e.target.value)}
      className="rounded-md border border-slate-600 bg-slate-700 px-3 py-1.5 text-sm text-white shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
    />
  );
}
