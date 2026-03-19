"use client";

export default function SkeletonLoader() {
  return (
    <div className="space-y-6 py-4">
      {/* First skeleton block - User message */}
      <div className="flex justify-end pr-4">
        <div className="h-10 w-1/2 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg animate-pulse" />
      </div>

      {/* Second skeleton block - AI message */}
      <div className="space-y-3 pl-4">
        <div className="h-10 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg animate-pulse max-w-md" />
        <div className="h-10 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg animate-pulse max-w-md" />
      </div>

      {/* Third skeleton block - User message */}
      <div className="flex justify-end pr-4">
        <div className="h-10 w-2/5 bg-gradient-to-r from-zinc-700 to-zinc-600 rounded-lg animate-pulse" />
      </div>

      {/* Fourth skeleton block - AI message */}
      <div className="space-y-3 pl-4">
        <div className="h-10 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg animate-pulse max-w-md" />
        <div className="h-10 bg-gradient-to-r from-zinc-800 to-zinc-700 rounded-lg animate-pulse max-w-md" />
      </div>
    </div>
  );
}
