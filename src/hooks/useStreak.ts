import { useEffect, useState } from 'react';
import { useAuth } from './useAuth';
import { subscribeToHabitRecords } from '@/lib/firestore';
import type { Habit } from '@/types';
import { getTodayString, getDayOfWeek, subtractDays } from '@/utils/dateUtils';

const calculateStreak = (
  habit: Habit,
  recordMap: Map<string, boolean>
): number => {
  const today = getTodayString();
  const todayDow = getDayOfWeek(today);

  // 今日がターゲット曜日かつ未達成なら昨日から遡る
  let date =
    habit.targetDays.includes(todayDow) && recordMap.get(today) !== true
      ? subtractDays(today, 1)
      : today;

  let streak = 0;
  for (let i = 0; i < 365; i++) {
    const dow = getDayOfWeek(date);

    if (!habit.targetDays.includes(dow)) {
      // ターゲット曜日でない日はスキップ
      date = subtractDays(date, 1);
      continue;
    }

    if (recordMap.get(date) === true) {
      streak++;
      date = subtractDays(date, 1);
    } else {
      // 未達成 or 記録なし → ストリーク終了
      break;
    }
  }

  return streak;
};

export const useStreak = (habit: Habit | null) => {
  const { user } = useAuth();
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || !habit) {
      setStreak(0);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToHabitRecords(user.uid, habit.id, (records) => {
      const recordMap = new Map(records.map((r) => [r.date, r.completed]));
      setStreak(calculateStreak(habit, recordMap));
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user, habit]);

  return { streak, loading };
};
