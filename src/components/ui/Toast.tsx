import type { ReactNode } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { FiCheckCircle, FiAlertCircle, FiInfo } from "react-icons/fi";
import type { IconType } from "react-icons";
import { colors, radius, shadow } from "../../theme.ts";
import type { ToastType } from "./toast-context.ts";
import { ToastContext } from "./toast-context.ts";

interface ToastItem {
  id: string;
  message: string;
  type: ToastType;
  exiting: boolean;
}

const typeColors: Record<ToastType, string> = {
  success: colors.green,
  error: colors.red,
  info: colors.cyan,
};

const typeIcons: Record<ToastType, IconType> = {
  success: FiCheckCircle,
  error: FiAlertCircle,
  info: FiInfo,
};

// Duration of the exit animation before the toast is actually removed.
const EXIT_MS = 220;

const keyframes = `@keyframes nexus-toast-in {
  from { transform: translateX(120%); opacity: 0; }
  to { transform: translateX(0); opacity: 1; }
}
@keyframes nexus-toast-out {
  from { transform: translateX(0); opacity: 1; }
  to { transform: translateX(120%); opacity: 0; }
}`;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const timers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  // Remove a toast from state and clear any pending timer for it.
  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
    const timer = timers.current[id];
    if (timer) {
      clearTimeout(timer);
      delete timers.current[id];
    }
  }, []);

  // Public dismiss: play the exit animation, then remove.
  const dismiss = useCallback(
    (id: string) => {
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, exiting: true } : t))
      );
      const existing = timers.current[id];
      if (existing) clearTimeout(existing);
      timers.current[id] = setTimeout(() => remove(id), EXIT_MS);
    },
    [remove]
  );

  const toast = useCallback(
    (message: string, type: ToastType = "info") => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
      setToasts((prev) => [...prev, { id, message, type, exiting: false }]);
      timers.current[id] = setTimeout(() => dismiss(id), 3000);
    },
    [dismiss]
  );

  useEffect(() => {
    const active = timers.current;
    return () => {
      Object.values(active).forEach((timer) => clearTimeout(timer));
    };
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <style>{keyframes}</style>
      <div
        style={{
          position: "fixed",
          top: 20,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 10,
          zIndex: 9999,
        }}
      >
        {toasts.map((t) => {
          const color = typeColors[t.type];
          const Icon = typeIcons[t.type];
          return (
            <div
              key={t.id}
              onClick={() => dismiss(t.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                backgroundColor: colors.panel,
                color: colors.text,
                border: `1px solid ${color}`,
                borderLeft: `4px solid ${color}`,
                borderRadius: radius.sm,
                padding: "12px 16px",
                minWidth: 220,
                maxWidth: 320,
                fontSize: 14,
                cursor: "pointer",
                boxShadow: shadow.lg,
                animation: t.exiting
                  ? `nexus-toast-out ${EXIT_MS}ms ease forwards`
                  : "nexus-toast-in 0.25s cubic-bezier(0.21,1.02,0.73,1) both",
              }}
            >
              <Icon size={18} style={{ color, flexShrink: 0 }} />
              <span>{t.message}</span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
