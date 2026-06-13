'use client';

import { motion } from 'framer-motion';
import CheckAnimation from '@/components/ui/CheckAnimation';
import StreakBadge from '@/components/ui/StreakBadge';
import { useStreak } from '@/hooks/useStreak';
import type { Habit } from '@/types';

interface Props {
  habit: Habit;
  completed: boolean;
  onToggle: () => void;
}

export default function HabitCard({ habit, completed, onToggle }: Props) {
  const { streak, loading: streakLoading } = useStreak(habit);

  return (
    <motion.li
      layout
      animate={{ opacity: completed ? 0.7 : 1 }}
      transition={{ duration: 0.25 }}
      className={`flex items-start gap-4 rounded-xl border px-4 py-3 transition-colors ${
        completed
          ? 'border-slate-700 bg-slate-800/50'
          : 'border-slate-700 bg-slate-800'
      }`}
    >
      {/* チェックボタン（アニメーション付き） */}
      <div className="mt-0.5 shrink-0">
        <CheckAnimation completed={completed} onToggle={onToggle} />
      </div>

      {/* 絵文字 */}
      <span className={`mt-0.5 text-2xl shrink-0 transition-opacity ${completed ? 'opacity-40' : ''}`}>
        {habit.emoji}
      </span>

      {/* テキスト + ストリーク */}
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
        {!completed && (
          <div className="mt-1.5 overflow-hidden">
            <StreakBadge streak={streak} loading={streakLoading} />
          </div>
        )}
      </div>
    </motion.li>
  );
}
