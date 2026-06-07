'use client';

import { useAuth } from "@/hooks/useAuth";

export default function Home() {
  const { user, loading, signOutUser } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-gradient-to-br from-slate-900 via-slate-850 to-indigo-950 px-4 font-sans text-white">
      <main className="w-full max-w-md rounded-2xl bg-slate-800/80 p-8 shadow-2xl backdrop-blur-md border border-slate-700 text-center">
        <div className="text-center mb-8">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-400 mb-4 border border-indigo-500/20">
            <span className="text-3xl">🧘</span>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">習慣トラッカー</h1>
          <p className="text-slate-400 mt-2 text-sm">ログインに成功しました！</p>
        </div>

        {user && (
          <div className="mb-8 p-4 rounded-xl bg-slate-900/60 border border-slate-750 text-left space-y-3">
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">ユーザー名</span>
              <p className="text-base font-medium text-slate-200 mt-0.5">{user.displayName || "未設定"}</p>
            </div>
            <div>
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">ユーザー ID (UID)</span>
              <p className="text-xs font-mono text-slate-350 mt-0.5 break-all">{user.uid}</p>
            </div>
            {user.email && (
              <div>
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider">メールアドレス</span>
                <p className="text-sm text-slate-200 mt-0.5">{user.email}</p>
              </div>
            )}
          </div>
        )}

        <button
          onClick={signOutUser}
          className="w-full rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white transition-all hover:bg-indigo-500 hover:shadow-lg hover:shadow-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 active:scale-[0.98] border border-indigo-500/30"
        >
          サインアウト
        </button>
      </main>
    </div>
  );
}
