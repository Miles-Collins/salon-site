"use client";
import React, { createContext, useCallback, useContext, useState } from "react";

type ToastItem = { id: number; type: "success" | "error" | "info"; message: string };

const ToastCtx = createContext<{
  success: (msg: string) => void;
  error: (msg: string) => void;
  info: (msg: string) => void;
} | null>(null);

export function useToast() {
  const ctx = useContext(ToastCtx);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const push = useCallback((type: ToastItem["type"], message: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3000);
  }, []);

  const api = {
    success: (msg: string) => push("success", msg),
    error: (msg: string) => push("error", msg),
    info: (msg: string) => push("info", msg),
  };

  return (
    <ToastCtx.Provider value={api}>
      {children}
      <div className="fixed bottom-6 right-6 z-[9999] space-y-3 max-w-sm pointer-events-none">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={`toast pointer-events-auto px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 text-white backdrop-blur-sm border ${
              t.type === "success"
                ? "bg-green-500/90 border-green-400/50 animate-fade-in-up"
                : t.type === "error"
                ? "bg-red-500/90 border-red-400/50 animate-fade-in-up"
                : "bg-[#C9A961]/90 border-[#C9A961]/50 animate-fade-in-up"
            }`}
          >
            <span className="text-xl font-bold flex-shrink-0">
              {t.type === "success" && "✓"}
              {t.type === "error" && "✕"}
              {t.type === "info" && "ℹ"}
            </span>
            <p className="flex-1 text-sm font-medium">{t.message}</p>
          </div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
