'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  completed: boolean;
  onToggle: () => void;
}

export default function CheckAnimation({ completed, onToggle }: Props) {
  return (
    <motion.button
      onClick={onToggle}
      aria-label={completed ? 'チェックを外す' : 'チェックする'}
      whileTap={{ scale: 0.85 }}
      className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
        completed
          ? 'border-indigo-500 bg-indigo-500 text-white'
          : 'border-slate-500 bg-transparent hover:border-indigo-400'
      }`}
    >
      {/* チェックマーク */}
      <AnimatePresence>
        {completed && (
          <motion.svg
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 25 }}
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={3}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* 完了時の波紋エフェクト */}
      <AnimatePresence>
        {completed && (
          <motion.span
            key="ripple"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 2.2, opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="absolute inset-0 rounded-full bg-indigo-400"
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
}
