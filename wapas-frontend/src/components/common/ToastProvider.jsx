import { useCallback, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import { ToastContext } from '../../hooks/useToast.js';

const icons = {
  success: <CheckCircle2 className="h-4 w-4 text-emerald-600" aria-hidden />,
  error: <AlertCircle className="h-4 w-4 text-red-600" aria-hidden />,
  info: <Info className="h-4 w-4 text-blue-600" aria-hidden />,
  neutral: <Info className="h-4 w-4 text-zinc-500" aria-hidden />,
};

export default function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const dismiss = useCallback((id) => setToasts((list) => list.filter((t) => t.id !== id)), []);

  const push = useCallback(
    ({ title, description, tone = 'neutral' }) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
      setToasts((list) => [...list.slice(-3), { id, title, description, tone }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss],
  );

  const value = useMemo(() => ({ push }), [push]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div aria-live="polite" className="pointer-events-none fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div key={t.id} role="status" className="pointer-events-auto flex items-start gap-3 rounded-lg border border-zinc-200 bg-white p-3 shadow-lg">
            <span className="mt-0.5">{icons[t.tone] ?? icons.neutral}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-zinc-900">{t.title}</p>
              {t.description && <p className="mt-0.5 text-[13px] text-zinc-500">{t.description}</p>}
            </div>
            <button type="button" aria-label="Dismiss" onClick={() => dismiss(t.id)} className="rounded p-1 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-700">
              <X className="h-3.5 w-3.5" aria-hidden />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
