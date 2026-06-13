'use client';

import Link from 'next/link';
import type { Habit } from '@/types';

interface Props {
  habits: Habit[];
  onDelete: (habitId: string) => void;
}

const DAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

export default function HabitList({ habits, onDelete }: Props) {
  const active = habits.filter((h) => h.isActive);

  if (active.length === 0) {
    return (
      <p className="text-center text-slate-400 py-12">
        習慣が登録されていません。
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {active.map((habit) => (
        <li
          key={habit.id}
          className="flex items-center gap-3 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3"
        >
          <span className="text-2xl">{habit.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-white truncate">{habit.name}</p>
            <p className="text-xs text-slate-400 mt-0.5">
              {habit.targetDays.map((d) => DAYS[d]).join('・')}
              {habit.category && (
                <span className="ml-2 text-indigo-400">{habit.category}</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Link
              href={`/habits/edit?id=${habit.id}`}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition-colors"
            >
              編集
            </Link>
            <button
              onClick={() => onDelete(habit.id)}
              className="rounded-lg px-3 py-1.5 text-xs font-medium text-red-400 hover:bg-slate-700 transition-colors"
            >
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
