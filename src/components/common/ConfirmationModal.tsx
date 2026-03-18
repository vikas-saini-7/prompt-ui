"use client";

import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDangerous = false,
  onConfirm,
  onCancel,
  isLoading = false,
}: ConfirmationModalProps) {
  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 z-50 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onCancel}
      />

      {/* Modal */}
      <div
        className={`fixed inset-0 flex items-center justify-center z-50 p-4 transition-opacity duration-200 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-w-sm w-full transform transition-transform duration-200 ${
            isOpen ? "scale-100" : "scale-95"
          }`}
        >
          {/* Header */}
          <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
            <AlertCircle
              className={`h-5 w-5 ${isDangerous ? "text-red-400" : "text-blue-400"}`}
            />
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>

          {/* Body */}
          <div className="p-4">
            <p className="text-sm text-zinc-300">{message}</p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-4 border-t border-zinc-800 justify-end">
            <Button
              onClick={onCancel}
              disabled={isLoading}
              variant="ghost"
              className="text-zinc-300 hover:bg-zinc-800"
            >
              {cancelText}
            </Button>
            <Button
              onClick={onConfirm}
              disabled={isLoading}
              className={`${
                isDangerous
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : "bg-[#00E87B] hover:bg-[#00E87B]/90 text-black"
              }`}
            >
              {isLoading ? "Loading..." : confirmText}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
