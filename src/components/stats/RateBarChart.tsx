'use client';

import { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import type { RateEntry } from '@/utils/statsUtils';

type View = 'week' | 'month';

interface Props {
  weekEntries: RateEntry[];
  monthEntries: RateEntry[];
}

export default function RateBarChart({ weekEntries, monthEntries }: Props) {
  const [view, setView] = useState<View>('week');
  const data = view === 'week' ? weekEntries : monthEntries;

  return (
    <div className="space-y-3">
      {/* 週/月 切り替えタブ */}
      <div className="flex gap-1 rounded-lg bg-slate-800 p-1 w-fit">
        {(['week', 'month'] as View[]).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-md px-4 py-1 text-sm font-medium transition-colors ${
              view === v
                ? 'bg-indigo-500 text-white'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {v === 'week' ? '週別' : '月別'}
          </button>
        ))}
      </div>

      {/* 棒グラフ */}
      <div className="h-48">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 8, left: 4, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(v) => `${v}%`}
            />
            <Tooltip
              cursor={{ fill: '#1e293b' }}
              contentStyle={{
                backgroundColor: '#1e293b',
                border: '1px solid #334155',
                borderRadius: '8px',
                color: '#f1f5f9',
                fontSize: 12,
              }}
              formatter={(_value, _name, entry) => [
                `${entry.payload.rate}% (${entry.payload.completed}/${entry.payload.total}日)`,
                '達成率',
              ]}
            />
            <Bar
              dataKey="rate"
              fill="#6366f1"
              radius={[4, 4, 0, 0]}
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
