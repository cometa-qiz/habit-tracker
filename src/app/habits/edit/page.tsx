import { Suspense } from 'react';
import HabitEditClient from './HabitEditClient';

export default function EditHabitPage() {
  return (
    <div className="min-h-screen bg-slate-900 px-4 py-8">
      <div className="mx-auto max-w-md">
        <h1 className="text-xl font-bold text-white mb-6">習慣を編集</h1>
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500" />
            </div>
          }
        >
          <HabitEditClient />
        </Suspense>
      </div>
    </div>
  );
}
