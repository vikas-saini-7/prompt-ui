"use client";

import React, { createContext, useState, useCallback, ReactNode } from "react";

interface UIContextType {
  // Sidebar
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  toggleSidebar: () => void;

  // Modal states
  showSettings: boolean;
  setShowSettings: (show: boolean) => void;

  // Theme
  theme: "dark" | "light";
  setTheme: (theme: "dark" | "light") => void;
}

export const UIContext = createContext<UIContextType | undefined>(undefined);

interface UIProviderProps {
  children: ReactNode;
}

export function UIProvider({ children }: UIProviderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  const toggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const value: UIContextType = {
    sidebarOpen,
    setSidebarOpen,
    toggleSidebar,
    showSettings,
    setShowSettings,
    theme,
    setTheme,
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
}
