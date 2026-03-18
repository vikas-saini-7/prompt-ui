"use client";

import { CheckCircle, AlertCircle, Info, X } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export type ToastType = "success" | "error" | "info";

interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

export default function Toast({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose,
}: ToastProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [remainingTime, setRemainingTime] = useState(duration);

  // Auto-dismiss timer - pauses when hovering
  useEffect(() => {
    if (duration <= 0 || isHovered) return;

    const timer = setTimeout(() => {
      setIsClosing(true);
    }, remainingTime);

    return () => clearTimeout(timer);
  }, [duration, isHovered, remainingTime]);

  // Track elapsed time when not hovering
  useEffect(() => {
    if (isHovered || remainingTime <= 0) return;

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newRemainingTime = Math.max(0, remainingTime - elapsed);

      if (newRemainingTime <= 0) {
        clearInterval(interval);
        setIsClosing(true);
      } else {
        setRemainingTime(newRemainingTime);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isHovered, remainingTime]);

  // Remove toast after closing animation completes
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        onClose(id);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isClosing, id, onClose]);

  const handleClose = () => {
    setIsClosing(true);
  };

  const getStyles = () => {
    switch (type) {
      case "success":
        return {
          bg: "bg-gray-500/10",
          border: "border-green-700",
          icon: <CheckCircle className="h-5 w-5 text-[#00E87B]" />,
        };
      case "error":
        return {
          bg: "bg-gray-500/10",
          border: "border-red-700",
          icon: <AlertCircle className="h-5 w-5 text-red-400" />,
        };
      case "info":
        return {
          bg: "bg-gray-500/10",
          border: "border-blue-700",
          icon: <Info className="h-5 w-5 text-blue-400" />,
        };
    }
  };

  const styles = getStyles();

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={isClosing ? { opacity: 0, x: 400 } : { opacity: 1, x: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`
        fixed top-4 right-4 max-w-sm w-full
        ${styles.bg} border ${styles.border} rounded-lg shadow-xl
        p-4 flex gap-3 items-start
        backdrop-blur-md
        z-[9999]
      `}
    >
      <div className="flex-shrink-0">{styles.icon}</div>
      <div className="flex-1 min-w-0">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        {message && <p className="text-xs text-zinc-300 mt-1">{message}</p>}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:opacity-70 transition-opacity"
      >
        <X className="h-4 w-4 text-zinc-400" />
      </button>
    </motion.div>
  );
}
