"use client";

import { useContext } from "react";
import { ToastContext } from "@/lib/contexts/toast-context";

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }

  return {
    success: (title: string, message?: string) =>
      context.show({
        type: "success",
        title,
        message,
        duration: 4000,
      }),
    error: (title: string, message?: string) =>
      context.show({
        type: "error",
        title,
        message,
        duration: 5000,
      }),
    info: (title: string, message?: string) =>
      context.show({
        type: "info",
        title,
        message,
        duration: 4000,
      }),
  };
}
