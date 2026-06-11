'use client';

interface Props {
  completed: number;
  total: number;
}

export default function ProgressBar({ completed, total }: Props) {
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="space-y-1.5">
      <div className="flex items-baseline justify-between">
        <p className="text-sm text-slate-300">
          今日は{total}個中
          <span className="font-bold text-white mx-1">{completed}個</span>
          できた
        </p>
        <span className="text-lg font-bold text-indigo-400">{rate}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-700">
        <div
          className="h-full rounded-full bg-indigo-500 transition-all duration-500"
          style={{ width: `${rate}%` }}
        />
      </div>
    </div>
  );
}
