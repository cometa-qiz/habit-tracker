'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

const NAV_LINKS = [
  { href: '/', label: '今日' },
  { href: '/stats', label: '統計' },
  { href: '/habits', label: '習慣管理' },
] as const;

export default function Header() {
  const pathname = usePathname();
  const { user, signOutUser } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  if (pathname === '/login') return null;

  return (
    <header className="sticky top-0 z-10 flex h-14 items-center justify-between bg-slate-900/90 px-4 backdrop-blur border-b border-slate-800">
      <div className="flex items-center gap-6">
        <span className="font-bold text-white tracking-tight">習慣トラッカー</span>
        {/* デスクトップ用ナビリンク */}
        {user && (
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map(({ href, label }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    active
                      ? 'bg-slate-800 text-indigo-400'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      {user && (
        <div className="relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors"
            aria-label="メニューを開く"
          >
            {(user.displayName ?? user.email ?? 'U')[0].toUpperCase()}
          </button>

          {menuOpen && (
            <>
              {/* オーバーレイ */}
              <div
                className="fixed inset-0 z-10"
                onClick={() => setMenuOpen(false)}
              />
              {/* ドロップダウン */}
              <div className="absolute right-0 z-20 mt-2 w-48 rounded-xl bg-slate-800 border border-slate-700 shadow-xl py-1">
                <p className="px-4 py-2 text-xs text-slate-400 truncate border-b border-slate-700">
                  {user.displayName ?? user.email}
                </p>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    signOutUser();
                  }}
                  className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-slate-700 transition-colors"
                >
                  サインアウト
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
}
