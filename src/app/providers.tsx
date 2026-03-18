"use client";

import { SessionProvider } from "next-auth/react";
import { ProfileProvider } from "@/contexts/profile-context";
import React from "react";
import { ToastProvider } from "@/lib/contexts/toast-context";
import { ChatProvider } from "@/contexts/chat-context";
import { UIProvider } from "@/contexts/ui-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={5 * 60}
      refetchOnWindowFocus={false}
      refetchWhenOffline={false}
    >
      <ProfileProvider>
        <ToastProvider>
          <ChatProvider>
            <UIProvider>{children}</UIProvider>
          </ChatProvider>
        </ToastProvider>
      </ProfileProvider>
    </SessionProvider>
  );
}
