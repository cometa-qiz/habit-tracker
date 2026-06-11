'use client';

import { useState } from 'react';
import type { Habit } from '@/types';

const DAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

type HabitFormData = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;

interface Props {
  initialValues?: Partial<HabitFormData>;
  onSubmit: (data: HabitFormData) => Promise<void>;
  onCancel: () => void;
}

export default function HabitForm({ initialValues, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [emoji, setEmoji] = useState(initialValues?.emoji ?? '✅');
  const [memo, setMemo] = useState(initialValues?.memo ?? '');
  const [category, setCategory] = useState(initialValues?.category ?? '');
  const [targetDays, setTargetDays] = useState<number[]>(
    initialValues?.targetDays ?? [0, 1, 2, 3, 4, 5, 6]
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const toggleDay = (day: number) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('習慣名は必須です');
      return;
    }
    if (name.trim().length > 50) {
      setError('習慣名は50文字以内で入力してください');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        emoji,
        memo,
        category,
        targetDays,
        isActive: initialValues?.isActive ?? true,
        order: initialValues?.order ?? 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 習慣名 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          習慣名 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          maxLength={50}
          placeholder="例: 毎朝ストレッチ"
          className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <div className="flex justify-between mt-1">
          {error && <p className="text-sm text-red-400">{error}</p>}
          <p className="text-xs text-slate-500 ml-auto">{name.length}/50</p>
        </div>
      </div>

      {/* 絵文字 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">絵文字</label>
        <input
          type="text"
          value={emoji}
          onChange={(e) => setEmoji(e.target.value)}
          placeholder="例: 🧘"
          className="w-20 rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white text-center text-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">一言メモ</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="例: 5分でOK"
          className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* カテゴリ */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">カテゴリ</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="例: 健康"
          className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* 実施曜日 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">実施曜日</label>
        <div className="flex gap-2">
          {DAYS.map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              className={`flex-1 rounded-lg py-2 text-sm font-medium transition-colors ${
                targetDays.includes(i)
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-700 text-slate-400 hover:bg-slate-600'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* ボタン */}
      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 rounded-xl border border-slate-600 py-3 text-sm font-semibold text-slate-300 hover:bg-slate-700 transition-colors"
        >
          キャンセル
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
        >
          {submitting ? '保存中...' : '保存'}
        </button>
      </div>
    </form>
  );
}
