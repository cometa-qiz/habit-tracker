import type { Habit } from '@/types';
import { getDayOfWeek, toDateString } from './dateUtils';

export interface DayCell {
  date: string;
  isTarget: boolean;
  completed: boolean;
}

export interface RateEntry {
  label: string;
  rate: number;
  completed: number;
  total: number;
}

/** 指定週（月曜始まり7日分の日付配列）ごとの達成状況を返す */
export const getWeekDayCells = (
  habit: Habit,
  recordMap: Map<string, boolean>,
  weekDates: string[]
): DayCell[] =>
  weekDates.map((date) => ({
    date,
    isTarget: habit.targetDays.includes(getDayOfWeek(date)),
    completed: recordMap.get(date) === true,
  }));

/** 指定月の全日付を DayCell[] で返す（カレンダー描画用） */
export const getMonthDayCells = (
  habit: Habit,
  recordMap: Map<string, boolean>,
  year: number,
  month: number
): DayCell[] => {
  const lastDate = new Date(year, month, 0).getDate();
  return Array.from({ length: lastDate }, (_, i) => {
    const date = toDateString(new Date(year, month - 1, i + 1));
    return {
      date,
      isTarget: habit.targetDays.includes(getDayOfWeek(date)),
      completed: recordMap.get(date) === true,
    };
  });
};

/**
 * 月の1日の曜日をもとに、月曜始まりカレンダーの先頭空白セル数を返す
 * 例: 1日が火曜 → 1（月曜分の空白）
 */
export const getMonthStartPadding = (year: number, month: number): number => {
  const firstDow = new Date(year, month - 1, 1).getDay(); // 0=Sun
  return (firstDow + 6) % 7;
};

/** 直近 numWeeks 週分の達成率を返す（今週含む） */
export const getWeeklyRates = (
  habit: Habit,
  recordMap: Map<string, boolean>,
  numWeeks = 8
): RateEntry[] => {
  const today = new Date();
  const dow = today.getDay();
  const thisMonday = new Date(today);
  thisMonday.setDate(today.getDate() - ((dow + 6) % 7));

  return Array.from({ length: numWeeks }, (_, i) => {
    const weekStart = new Date(thisMonday);
    weekStart.setDate(thisMonday.getDate() - (numWeeks - 1 - i) * 7);

    let completed = 0;
    let total = 0;

    for (let d = 0; d < 7; d++) {
      const day = new Date(weekStart);
      day.setDate(weekStart.getDate() + d);
      const dateStr = toDateString(day);
      if (habit.targetDays.includes(getDayOfWeek(dateStr))) {
        total++;
        if (recordMap.get(dateStr) === true) completed++;
      }
    }

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    const label = `${weekStart.getMonth() + 1}/${weekStart.getDate()}〜${weekEnd.getMonth() + 1}/${weekEnd.getDate()}`;
    return {
      label,
      rate: total === 0 ? 0 : Math.round((completed / total) * 100),
      completed,
      total,
    };
  });
};

/** 直近 numMonths ヶ月分の達成率を返す（今月含む） */
export const getMonthlyRates = (
  habit: Habit,
  recordMap: Map<string, boolean>,
  numMonths = 6
): RateEntry[] => {
  const today = new Date();

  return Array.from({ length: numMonths }, (_, i) => {
    const target = new Date(today.getFullYear(), today.getMonth() - (numMonths - 1 - i), 1);
    const year = target.getFullYear();
    const month = target.getMonth() + 1;
    const lastDate = new Date(year, month, 0).getDate();

    let completed = 0;
    let total = 0;

    for (let d = 1; d <= lastDate; d++) {
      const dateStr = toDateString(new Date(year, month - 1, d));
      if (habit.targetDays.includes(getDayOfWeek(dateStr))) {
        total++;
        if (recordMap.get(dateStr) === true) completed++;
      }
    }

    return {
      label: `${month}月`,
      rate: total === 0 ? 0 : Math.round((completed / total) * 100),
      completed,
      total,
    };
  });
};

/** 達成率を計算する（0 割り安全） */
export const calcRate = (completed: number, total: number): number =>
  total === 0 ? 0 : Math.round((completed / total) * 100);
