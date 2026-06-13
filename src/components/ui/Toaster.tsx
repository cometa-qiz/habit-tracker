'use client';

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type ToastType = 'error' | 'success';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  addToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType = 'error') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* モバイルではBottomNav(64px)の上、デスクトップでは画面下 */}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed bottom-20 left-0 right-0 z-50 flex flex-col items-center gap-2 px-4 md:bottom-4"
      >
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.p
              key={toast.id}
              role="alert"
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 12, scale: 0.96 }}
              transition={{ duration: 0.2 }}
              className={`w-full max-w-sm rounded-xl px-4 py-3 text-sm font-medium shadow-lg ${
                toast.type === 'success'
                  ? 'bg-green-600/95 text-white'
                  : 'bg-red-600/95 text-white'
              }`}
            >
              {toast.message}
            </motion.p>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx.addToast;
}
