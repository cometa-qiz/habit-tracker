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
      className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
    />
  );
}
