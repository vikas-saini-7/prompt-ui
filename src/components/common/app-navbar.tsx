"use client";

import { Settings, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  onToggleSidebar: () => void;
  onSettingsClick?: () => void;
  title?: string;
  subtitle?: string;
  logo?: React.ReactNode;
}

export default function AppNavbar({
  onToggleSidebar,
  onSettingsClick,
  title = "Prompt UI",
  subtitle = "AI Component Generator",
  logo,
}: Props) {
  return (
    <nav className="border-b border-zinc-800 bg-[#0F0F0F]">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleSidebar}
            className="hover:bg-zinc-900 -ml-2"
            title="Toggle History"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {logo ? (
            logo
          ) : (
            <>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#00E87B]">
                <span className="text-sm font-bold text-black">P</span>
              </div>
              <div>
                <h1 className="text-lg font-semibold text-white">{title}</h1>
                <p className="text-xs text-zinc-500">{subtitle}</p>
              </div>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="hover:bg-zinc-900"
          title="Settings"
          onClick={onSettingsClick}
        >
          <Settings className="h-4 w-4" />
        </Button>
      </div>
    </nav>
  );
}
