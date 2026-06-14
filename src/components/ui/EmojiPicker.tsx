'use client';

const EMOJI_LIST = [
  '🏃', '🧘', '💪', '🚴', '🏋️', '🤸',
  '🏊', '🚶', '💧', '🥗', '🍎', '💊',
  '🥦', '🥤', '📚', '📝', '🎯', '💡',
  '✍️', '🧠', '😴', '🛁', '🪥', '🧹',
  '💻', '🎨', '🎵', '✅', '⭐', '🔥',
] as const;

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: Props) {
  return (
    <div className="grid grid-cols-6 gap-2">
      {EMOJI_LIST.map((emoji) => (
        <button
          key={emoji}
          type="button"
          onClick={() => onChange(emoji)}
          aria-pressed={value === emoji}
          className={`rounded-lg p-2 text-2xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            value === emoji
              ? 'bg-indigo-600 ring-2 ring-indigo-400'
              : 'bg-slate-700 hover:bg-slate-600'
          }`}
        >
          {emoji}
        </button>
      ))}
    </div>
  );
}
