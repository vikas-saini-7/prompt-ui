"use client";

import React, { createContext, useState, useCallback, ReactNode } from "react";
import Toast, { ToastType } from "@/components/common/Toast";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextType {
  toasts: ToastMessage[];
  show: (params: Omit<ToastMessage, "id">) => void;
  remove: (id: string) => void;
}

export const ToastContext = createContext<ToastContextType | undefined>(
  undefined,
);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const show = useCallback((params: Omit<ToastMessage, "id">) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastMessage = {
      id,
      ...params,
    };
    setToasts((prev) => [...prev, newToast]);
  }, []);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, show, remove }}>
      {children}
      {/* Toast Container */}
      <div className="pointer-events-none">
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast
              id={toast.id}
              type={toast.type}
              title={toast.title}
              message={toast.message}
              duration={toast.duration}
              onClose={remove}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
