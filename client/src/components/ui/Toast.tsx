import {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type ToastType = "success" | "error";

type Toast = {
  id: string;
  message: string;
  type: ToastType;
  exiting: boolean; // true while the exit animation is playing
};

type ToastContextValue = {
  success: (message: string) => void;
  error: (message: string) => void;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const ToastContext = createContext<ToastContextValue | null>(null);

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useToast = (): ToastContextValue => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used inside <ToastProvider>");
  return ctx;
};

// ─── Single Toast Item ────────────────────────────────────────────────────────

const DISPLAY_MS = 3500; // how long each toast stays visible
const EXIT_MS = 220;     // must match toast-exit animation duration in CSS

const ToastItem = ({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) => {
  // Trigger the exit animation after DISPLAY_MS, then remove after EXIT_MS
  useEffect(() => {
    const exitTimer = setTimeout(() => onDismiss(toast.id), DISPLAY_MS);
    return () => clearTimeout(exitTimer);
  }, [toast.id, onDismiss]);

  const isSuccess = toast.type === "success";

  return (
    <div
      className={`toast-enter ${toast.exiting ? "toast-exit" : ""} flex w-full max-w-sm items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-lg`}
      style={{
        background: "var(--toast-bg)",
        borderColor: "var(--toast-border)",
      }}
    >
      {/* Coloured dot indicator */}
      <span
        className="mt-0.5 h-2 w-2 flex-shrink-0 rounded-full"
        style={{
          background: isSuccess ? "var(--income-accent)" : "var(--expense-accent)",
        }}
      />

      <p className="app-text-muted flex-1 text-sm leading-6">{toast.message}</p>

      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        className="app-text-faint mt-0.5 flex-shrink-0 text-xs leading-none transition hover:opacity-70"
        aria-label="Dismiss"
      >
        ✕
      </button>
    </div>
  );
};

// ─── Toaster (renders the stack) ──────────────────────────────────────────────

const Toaster = ({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) => {
  if (toasts.length === 0) return null;

  return (
    // Fixed bottom-right, above everything
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">
      {toasts.map((t) => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Start exit animation, then remove from state after animation finishes
  const dismiss = useCallback((id: string) => {
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, exiting: true } : t)),
    );
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, EXIT_MS);
  }, []);

  const add = useCallback(
    (message: string, type: ToastType) => {
      const id = Math.random().toString(36).slice(2, 9);
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
    },
    [],
  );

  const value: ToastContextValue = {
    success: (message) => add(message, "success"),
    error: (message) => add(message, "error"),
  };

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toaster toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
};
