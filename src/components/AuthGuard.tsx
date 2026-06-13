'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import type { User } from 'firebase/auth';
import { auth } from '@/lib/firebase';

const isLoginPath = (pathname: string) =>
  pathname === '/login' || pathname === '/login/';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 3000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        clearTimeout(timer);
        setUser(currentUser);
        setLoading(false);
      },
      () => {
        clearTimeout(timer);
        setUser(null);
        setLoading(false);
      }
    );

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!user && !isLoginPath(pathname)) router.push('/login');
    else if (user && isLoginPath(pathname)) router.push('/');
  }, [user, loading, pathname, router]);

  // /login はスキップしてそのまま表示
  if (isLoginPath(pathname)) return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900 text-white">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-indigo-500" />
      </div>
    );
  }

  return <>{children}</>;
}
