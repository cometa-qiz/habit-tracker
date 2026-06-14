export const CATEGORY_PRESETS = [
  '健康',
  '運動',
  '勉強',
  '仕事',
  '生活',
  '趣味',
  'その他',
] as const;

export type CategoryPreset = (typeof CATEGORY_PRESETS)[number];
