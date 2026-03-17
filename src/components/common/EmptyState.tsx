"use client";

import { Sparkles, LucideIcon } from "lucide-react";

interface Props {
  title?: string;
  description?: string;
  icon?: LucideIcon;
}

export default function EmptyState({
  title = "Start Creating",
  description = "Describe a UI component and watch it come to life",
  icon: Icon = Sparkles,
}: Props) {
  return (
    <div className="h-full w-full flex items-center justify-center bg-[#0F0F0F]">
      <div className="text-center px-6">
        {/* <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-900 mx-auto mb-4">
          <Icon className="h-8 w-8 text-[#00E87B]" />
        </div> */}
        <h2 className="text-xl font-semibold text-white mb-2">{title}</h2>
        <p className="text-sm text-zinc-400 mb-6">{description}</p>
      </div>
    </div>
  );
}
