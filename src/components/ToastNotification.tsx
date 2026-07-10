/* ============================================================
   [NEW] ToastNotification.tsx
   Premium toast notifications sliding in from top-right
   with gold accent border and auto-dismiss progress bar.
   ============================================================ */

import { useState, useEffect, useCallback } from 'react';
import { X, Check, ShoppingBag, Bell, AlertTriangle } from 'lucide-react';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warn';
  duration?: number; // ms, default 4000
}

interface ToastItemProps {
  toast: Toast;
  onDismiss: (id: string) => void;
}

function ToastItem({ toast, onDismiss }: ToastItemProps) {
  const [exiting, setExiting] = useState(false);
  const duration = toast.duration || 4000;

  useEffect(() => {
    const timer = setTimeout(() => {
      setExiting(true);
      setTimeout(() => onDismiss(toast.id), 300);
    }, duration);

    return () => clearTimeout(timer);
  }, [toast.id, duration, onDismiss]);

  const handleDismiss = () => {
    setExiting(true);
    setTimeout(() => onDismiss(toast.id), 300);
  };

  const Icon = toast.type === 'success' ? Check
    : toast.type === 'warn' ? AlertTriangle
    : Bell;

  const borderColor = toast.type === 'success' ? 'border-l-emerald-500'
    : toast.type === 'warn' ? 'border-l-amber-500'
    : 'border-l-[#C5A059]';

  const iconBg = toast.type === 'success' ? 'bg-emerald-500/10 text-emerald-600'
    : toast.type === 'warn' ? 'bg-amber-500/10 text-amber-600'
    : 'bg-[#C5A059]/10 text-[#C5A059]';

  return (
    <div
      className={`
        ${exiting ? 'toast-exit' : 'toast-enter'}
        relative overflow-hidden
        bg-white/95 backdrop-blur-md
        border border-[#C5A059]/15 ${borderColor} border-l-[3px]
        rounded-lg shadow-xl
        p-3.5 pr-8
        flex items-start gap-3
        max-w-sm w-full
      `}
    >
      {/* Icon */}
      <div className={`p-1.5 rounded-md ${iconBg} shrink-0`}>
        <Icon className="w-3.5 h-3.5" />
      </div>

      {/* Message */}
      <div className="flex-1 min-w-0">
        <span className="block text-[9px] font-mono uppercase tracking-widest text-[#C5A059] mb-0.5">
          {toast.type === 'success' ? 'Confirmed' : toast.type === 'warn' ? 'Attention' : 'Notification'}
        </span>
        <p className="text-[11px] text-neutral-700 leading-snug font-sans">
          {toast.message}
        </p>
      </div>

      {/* Dismiss button */}
      <button
        onClick={handleDismiss}
        className="absolute top-2.5 right-2.5 text-neutral-400 hover:text-neutral-700 transition-colors p-0.5"
        aria-label="Dismiss notification"
      >
        <X className="w-3 h-3" />
      </button>

      {/* Auto-dismiss progress bar */}
      <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-neutral-100">
        <div
          className="h-full bg-[#C5A059]/60 toast-progress-bar"
          style={{ animationDuration: `${duration}ms` }}
        />
      </div>
    </div>
  );
}

interface ToastContainerProps {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}

export function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  return (
    <div
      className="fixed top-20 right-4 z-[9990] flex flex-col gap-2.5 pointer-events-none"
      aria-live="polite"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <div key={toast.id} className="pointer-events-auto">
          <ToastItem toast={toast} onDismiss={onDismiss} />
        </div>
      ))}
    </div>
  );
}
