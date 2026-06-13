'use client';

import { useRouter } from 'next/navigation';
import HabitForm from '@/components/habits/HabitForm';
import { useHabits } from '@/hooks/useHabits';
import type { Habit } from '@/types';

type HabitFormData = Omit<Habit, 'id' | 'createdAt' | 'updatedAt'>;

export default function NewHabitPage() {
  const router = useRouter();
  const { habits, add } = useHabits();

  const handleSubmit = async (data: HabitFormData) => {
    await add({ ...data, order: habits.length });
    router.push('/habits');
  };

  return (
    <div className="min-h-screen bg-slate-900 px-4 pt-6 pb-24">
      <div className="mx-auto max-w-md">
        <h1 className="text-xl font-bold text-white mb-6">習慣を追加</h1>
        <HabitForm
          onSubmit={handleSubmit}
          onCancel={() => router.push('/habits')}
        />
      </div>
    </div>
  );
}
