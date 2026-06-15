'use client';

import { useEffect, useRef, useState } from 'react';

const EMOJI_CATEGORIES = [
  {
    label: '健康・運動',
    emojis: ['🏃', '🧘', '💪', '🚴', '🏋️', '🤸', '🏊', '🚶', '💧', '🥗', '🍎', '💊', '🥦', '🥤'],
  },
  {
    label: '学習・仕事',
    emojis: ['📚', '📝', '🎯', '💡', '✍️', '🧠', '💻'],
  },
  {
    label: '生活',
    emojis: ['😴', '🛁', '🪥', '🧹'],
  },
  {
    label: '趣味・その他',
    emojis: ['🎨', '🎵', '✅', '⭐', '🔥'],
  },
] as const;

interface Props {
  value: string;
  onChange: (emoji: string) => void;
}

export default function EmojiPicker({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  function handleSelect(emoji: string) {
    onChange(emoji);
    setIsOpen(false);
  }

  return (
    <div ref={containerRef} className="relative inline-block">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="rounded-lg bg-slate-700 px-4 py-2 text-2xl transition-colors hover:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        {value || '😊'}
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute left-0 top-full z-50 mt-1 w-72 rounded-xl border border-slate-600 bg-slate-800 p-3 shadow-xl"
        >
          {EMOJI_CATEGORIES.map((category) => (
            <div key={category.label} className="mb-3 last:mb-0">
              <p className="mb-1 text-xs font-semibold text-slate-400">{category.label}</p>
              <div className="grid grid-cols-7 gap-1">
                {category.emojis.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    role="option"
                    aria-selected={value === emoji}
                    onClick={() => handleSelect(emoji)}
                    className={`rounded-lg p-1.5 text-xl transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                      value === emoji
                        ? 'bg-indigo-600 ring-2 ring-indigo-400'
                        : 'hover:bg-slate-600'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
