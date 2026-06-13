'use client';

import { createContext, useContext, useEffect, useState, createElement } from 'react';
import type { ReactNode } from 'react';
import {
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOutUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 10秒以内に onAuthStateChanged が応答しない場合は未認証として扱う
    const timer = setTimeout(() => {
      setUser(null);
      setLoading(false);
    }, 10000);

    const unsubscribe = onAuthStateChanged(
      auth,
      (currentUser) => {
        clearTimeout(timer);
        setUser(currentUser);
        setLoading(false);
      },
      () => {
        // auth エラー時も未認証として扱いスピナーを解除する
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

  const signInWithGoogle = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error signing in with Google: ', error);
      setLoading(false);
      throw error;
    }
  };

  const signOutUser = async () => {
    setLoading(true);
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Error signing out: ', error);
      setLoading(false);
      throw error;
    }
  };

  return createElement(
    AuthContext.Provider,
    { value: { user, loading, signInWithGoogle, signOutUser } },
    children
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
