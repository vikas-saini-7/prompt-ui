"use client";

export default function SkeletonLoader() {
  return (
    <div className="space-y-4 py-4">
      {/* Left message (AI) - multiple lines */}
      <div className="space-y-2">
        <div className="h-3 bg-zinc-700 rounded-full animate-pulse w-3/4" />
        <div className="h-3 bg-zinc-700 rounded-full animate-pulse w-2/3" />
      </div>

      {/* Right message (User) - single line */}
      <div className="flex justify-end">
        <div className="h-3 bg-zinc-600 rounded-full animate-pulse w-1/3" />
      </div>

      {/* Left message (AI) - multiple lines */}
      <div className="space-y-2">
        <div className="h-3 bg-zinc-700 rounded-full animate-pulse w-4/5" />
        <div className="h-3 bg-zinc-700 rounded-full animate-pulse w-1/2" />
        <div className="h-3 bg-zinc-700 rounded-full animate-pulse w-2/3" />
      </div>

      {/* Right message (User) - single line */}
      <div className="flex justify-end">
        <div className="h-3 bg-zinc-600 rounded-full animate-pulse w-2/5" />
      </div>
    </div>
  );
}
