'use client';

import { useState } from 'react';
import type { Habit } from '@/types';
import EmojiPicker from '@/components/ui/EmojiPicker';
import { CATEGORY_PRESETS } from '@/lib/constants';

const DAYS = ['日', '月', '火', '水', '木', '金', '土'] as const;

const LIMITS = {
  name: 50,
  memo: 100,
  category: 20,
} as const;

type HabitFormData = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;

interface Props {
  initialValues?: Partial<HabitFormData>;
  onSubmit: (data: HabitFormData) => Promise<void>;
  onCancel: () => void;
}

interface FieldErrors {
  name?: string;
  targetDays?: string;
}

export default function HabitForm({ initialValues, onSubmit, onCancel }: Props) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [emoji, setEmoji] = useState(initialValues?.emoji ?? '✅');
  const [memo, setMemo] = useState(initialValues?.memo ?? '');
  const initialCategory = initialValues?.category ?? '';
  const initialIsCustom =
    initialCategory !== '' &&
    !(CATEGORY_PRESETS as readonly string[]).includes(initialCategory);
  const [category, setCategory] = useState(initialCategory);
  const [isCustom, setIsCustom] = useState(initialIsCustom);
  const [targetDays, setTargetDays] = useState<number[]>(
    initialValues?.targetDays ?? [0, 1, 2, 3, 4, 5, 6]
  );
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});

  const toggleDay = (day: number) => {
    setTargetDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day].sort()
    );
    // 曜日を変更したらエラーをクリア
    setErrors((prev) => ({ ...prev, targetDays: undefined }));
  };

  const validate = (): FieldErrors => {
    const next: FieldErrors = {};
    if (!name.trim()) {
      next.name = '習慣名は必須です';
    } else if (name.trim().length > LIMITS.name) {
      next.name = `習慣名は${LIMITS.name}文字以内で入力してください`;
    }
    if (targetDays.length === 0) {
      next.targetDays = '実施曜日を1つ以上選択してください';
    }
    return next;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const next = validate();
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        emoji: emoji.trim() || '✅',
        memo: memo.trim(),
        category: category.trim(),
        targetDays,
        isActive: initialValues?.isActive ?? true,
        order: initialValues?.order ?? 0,
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      {/* 習慣名 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">
          習慣名 <span className="text-red-400">*</span>
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setErrors((prev) => ({ ...prev, name: undefined }));
          }}
          maxLength={LIMITS.name}
          placeholder="例: 毎朝ストレッチ"
          aria-invalid={!!errors.name}
          className={`w-full rounded-lg bg-slate-700 border px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            errors.name ? 'border-red-500' : 'border-slate-600'
          }`}
        />
        <div className="flex justify-between mt-1 min-h-[1.25rem]">
          {errors.name && (
            <p className="text-xs text-red-400" role="alert">{errors.name}</p>
          )}
          <p className={`text-xs ml-auto ${name.length >= LIMITS.name ? 'text-red-400' : 'text-slate-500'}`}>
            {name.length}/{LIMITS.name}
          </p>
        </div>
      </div>

      {/* 絵文字 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">絵文字</label>
        <EmojiPicker value={emoji} onChange={setEmoji} />
      </div>

      {/* メモ */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">一言メモ</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          maxLength={LIMITS.memo}
          placeholder="例: 5分でOK"
          className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <p className={`text-xs mt-1 text-right ${memo.length >= LIMITS.memo ? 'text-red-400' : 'text-slate-500'}`}>
          {memo.length}/{LIMITS.memo}
        </p>
      </div>

      {/* カテゴリ */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">カテゴリ</label>
        <select
          value={isCustom ? '__custom__' : category}
          onChange={(e) => {
            if (e.target.value === '__custom__') {
              setIsCustom(true);
              setCategory('');
            } else {
              setIsCustom(false);
              setCategory(e.target.value);
            }
          }}
          className="w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">選択してください</option>
          {CATEGORY_PRESETS.map((preset) => (
            <option key={preset} value={preset}>{preset}</option>
          ))}
          <option value="__custom__">新規追加...</option>
        </select>
        {isCustom && (
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            maxLength={LIMITS.category}
            placeholder="カテゴリ名を入力"
            className="mt-2 w-full rounded-lg bg-slate-700 border border-slate-600 px-3 py-2 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        )}
        {isCustom && (
          <p className={`text-xs mt-1 text-right ${category.length >= LIMITS.category ? 'text-red-400' : 'text-slate-500'}`}>
            {category.length}/{LIMITS.category}
          </p>
        )}
      </div>

      {/* 実施曜日 */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-2">
          実施曜日 <span className="text-red-400">*</span>
        </label>
        <div className="flex gap-1">
          {DAYS.map((label, i) => (
            <button
              key={i}
              type="button"
              onClick={() => toggleDay(i)}
              aria-pressed={targetDays.includes(i)}
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
        {errors.targetDays && (
          <p className="text-xs text-red-400 mt-1" role="alert">{errors.targetDays}</p>
        )}
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
