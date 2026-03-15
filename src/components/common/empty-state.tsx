"use client";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6">
      <h2 className="mb-2 text-xl font-semibold text-white">
        Generate Your First Component
      </h2>
      <p className="text-center text-sm text-zinc-400 max-w-sm">
        Describe a UI component or layout in natural language and watch as AI
        generates the code for you instantly.
      </p>
    </div>
  );
}
