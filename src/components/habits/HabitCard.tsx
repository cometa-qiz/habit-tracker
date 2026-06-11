'use client';

import { motion } from 'framer-motion';
import CheckAnimation from '@/components/ui/CheckAnimation';
import type { Habit } from '@/types';

interface Props {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
}

export default function HabitCard({ habit, completed, onToggle }: Props) {
  return (
    <motion.li
      layout
      animate={{ opacity: completed ? 0.7 : 1 }}
      transition={{ duration: 0.25 }}
      className={`flex items-center gap-4 rounded-xl border px-4 py-3 transition-colors ${
        completed
          ? 'border-slate-700 bg-slate-800/50'
          : 'border-slate-700 bg-slate-800'
      }`}
    >
      {/* チェックボタン（アニメーション付き） */}
      <CheckAnimation completed={completed} onToggle={onToggle} />

      {/* 絵文字 */}
      <span className={`text-2xl transition-opacity ${completed ? 'opacity-40' : ''}`}>
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
    </motion.li>
  );
}
