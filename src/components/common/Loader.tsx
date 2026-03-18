"use client";

export default function Loader() {
  return (
    <div className="flex items-center gap-2 p-4">
      <div className="flex gap-1">
        <div
          className="h-2 w-2 rounded-full bg-[#00E87B] loader-dot"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="h-2 w-2 rounded-full bg-[#00E87B] loader-dot"
          style={{ animationDelay: "0.2s" }}
        />
        <div
          className="h-2 w-2 rounded-full bg-[#00E87B] loader-dot"
          style={{ animationDelay: "0.4s" }}
        />
      </div>
      <span className="text-xs text-zinc-400">Generating component...</span>
    </div>
  );
}
