/**
 * Date オブジェクトを YYYY-MM-DD 形式の文字列に変換する
 */
export const toDateString = (date: Date): string => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

/**
 * 今日の日付を YYYY-MM-DD 形式で返す
 */
export const getTodayString = (): string => toDateString(new Date());

/**
 * YYYY-MM-DD 文字列から曜日番号を返す（0=日, 1=月, ..., 6=土）
 */
export const getDayOfWeek = (dateStr: string): number =>
  new Date(`${dateStr}T00:00:00`).getDay();

/**
 * YYYY-MM-DD 文字列から n 日前の日付文字列を返す
 */
export const subtractDays = (dateStr: string, n: number): string => {
  const date = new Date(`${dateStr}T00:00:00`);
  date.setDate(date.getDate() - n);
  return toDateString(date);
};

/**
 * 今週（月曜始まり）の日付文字列を配列で返す
 * 例: ['2026-06-08', '2026-06-09', ..., '2026-06-14']
 */
export const getThisWeekDates = (): string[] => {
  const today = new Date();
  const dow = today.getDay(); // 0=Sun
  // 月曜日を週の起点にする
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dow + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return toDateString(d);
  });
};
