'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import HabitForm from '@/components/habits/HabitForm';
import { useHabits } from '@/hooks/useHabits';
import type { Habit } from '@/types';

type HabitFormData = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;

export default function HabitEditClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const habitId = searchParams.get('id');
  const { habits, update } = useHabits();

  const habit = habits.find((h) => h.id === habitId);

  if (!habitId) {
    return <p className="text-slate-400">習慣IDが指定されていません。</p>;
  }

  if (!habit) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500" />
      </div>
    );
  }

  const handleSubmit = async (data: HabitFormData) => {
    await update(habitId, data);
    router.push('/habits');
  };

  return (
    <HabitForm
      initialValues={habit}
      onSubmit={handleSubmit}
      onCancel={() => router.push('/habits')}
    />
  );
}
