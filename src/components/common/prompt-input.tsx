"use client";

import { useState } from "react";
import { Send, Plus } from "lucide-react";

interface Props {
  onSubmit: (prompt: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

export default function PromptInput({
  onSubmit,
  onClear,
  isLoading = false,
  disabled = false,
}: Props) {
  const [prompt, setPrompt] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && !isLoading && !disabled) {
      onSubmit(prompt);
      setPrompt("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && e.ctrlKey) {
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      {/* Input Container */}
      <div className="flex items-center gap-3 px-2 py-2 border border-zinc-800 bg-zinc-900 rounded-lg hover:border-zinc-700 transition-colors">
        {/* Plus Icon Button */}
        <button
          type="button"
          disabled={isLoading || disabled}
          className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[#00E87B] transition-colors disabled:opacity-50"
          title="More options"
        >
          <Plus className="h-5 w-5" />
        </button>

        {/* Text Input */}
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Describe a UI component..."
          disabled={isLoading || disabled}
          className="flex-1 bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none disabled:opacity-50 border-0 p-0"
        />

        {/* Send Button */}
        <button
          type="submit"
          disabled={!prompt.trim() || isLoading || disabled}
          title="Generate (Ctrl+Enter)"
          className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded bg-[#00E87B] text-black hover:bg-[#00E87B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
