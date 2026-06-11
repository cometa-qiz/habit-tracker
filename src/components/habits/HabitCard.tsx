'use client';

import type { Habit } from '@/types';

interface Props {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
}

export default function HabitCard({ habit, completed, onToggle }: Props) {
  return (
    <li
      className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
        completed
          ? 'border-slate-700 bg-slate-800/50'
          : 'border-slate-700 bg-slate-800'
      }`}
    >
      {/* チェックボタン */}
      <button
        onClick={onToggle}
        aria-label={completed ? 'チェックを外す' : 'チェックする'}
        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
          completed
            ? 'border-indigo-500 bg-indigo-500 text-white'
            : 'border-slate-500 bg-transparent hover:border-indigo-400'
        }`}
      >
        {completed && (
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </button>

      {/* 絵文字 */}
      <span className={`text-2xl ${completed ? 'opacity-40' : ''}`}>
        {habit.emoji}
      </span>

      {/* テキスト */}
      <div className="flex-1 min-w-0">
        <p
          className={`font-medium truncate transition-colors ${
            completed ? 'text-slate-500 line-through' : 'text-white'
          }`}
        >
          {habit.name}
        </p>
        {habit.memo && (
          <p className={`text-xs mt-0.5 truncate ${completed ? 'text-slate-600' : 'text-slate-400'}`}>
            {habit.memo}
          </p>
        )}
      </div>
    </li>
  );
}
