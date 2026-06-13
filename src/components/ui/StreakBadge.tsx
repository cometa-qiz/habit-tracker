'use client';

import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  streak: number;
  loading?: boolean;
}

export default function StreakBadge({ streak, loading = false }: Props) {
  if (loading || streak === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        key={streak}
        initial={{ opacity: 0, scale: 0.8, y: -4 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        className="inline-flex items-center gap-1.5 rounded-full bg-orange-500/20 px-3 py-1 text-sm font-semibold text-orange-400 ring-1 ring-orange-500/40"
        aria-label={`${streak}日連続達成中`}
      >
        <span aria-hidden="true">🔥</span>
        {streak}日連続達成中！
      </motion.div>
    </AnimatePresence>
  );
}
