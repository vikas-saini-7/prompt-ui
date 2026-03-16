"use client";

import { useState, useEffect, useRef } from "react";
import {
  Send,
  Plus,
  ChevronUp,
  ChevronDown,
  Upload,
  Camera,
} from "lucide-react";

interface Props {
  onSubmit: (prompt: string) => void;
  onClear: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

const MODELS = ["GPT-4", "GPT-3.5", "Claude 3", "Claude 2", "Gemini Pro"];

const OPTIONS = [
  { id: "upload", label: "Upload File", icon: Upload },
  { id: "camera", label: "Camera", icon: Camera },
];

export default function PromptInput({
  onSubmit,
  onClear,
  isLoading = false,
  disabled = false,
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(MODELS[0]);
  const [showModels, setShowModels] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modelContainerRef.current &&
        !modelContainerRef.current.contains(event.target as Node)
      ) {
        setShowModels(false);
      }
      if (
        optionsContainerRef.current &&
        !optionsContainerRef.current.contains(event.target as Node)
      ) {
        setShowOptions(false);
      }
    };

    if (showModels || showOptions) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showModels, showOptions]);

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
    <form onSubmit={handleSubmit} className="w-full relative">
      {/* Model Button - Absolutely Positioned */}
      <div
        ref={modelContainerRef}
        className="absolute left-0 bottom-[calc(100%+0px)] "
      >
        <button
          type="button"
          onClick={() => setShowModels(!showModels)}
          disabled={isLoading || disabled}
          className=" bg-[#0F0F0F] flex items-center gap-1 px-2 py-1 text-xs text-zinc-400 hover:text-[#00E87B] transition-colors disabled:opacity-50"
        >
          <span>{selectedModel}</span>
          {showModels ? (
            <ChevronUp className="h-3 w-3" />
          ) : (
            <ChevronDown className="h-3 w-3" />
          )}
        </button>

        {/* Models Dropdown */}
        {showModels && (
          <div className="absolute left-0 bottom-full mb-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg z-50">
            {MODELS.map((model) => (
              <button
                key={model}
                type="button"
                onClick={() => {
                  setSelectedModel(model);
                  setShowModels(false);
                }}
                className={`w-full text-left px-3 py-2 text-xs transition-colors ${
                  selectedModel === model
                    ? "bg-[#00E87B] text-black"
                    : "text-zinc-400 hover:bg-zinc-800 hover:text-[#00E87B] whitespace-nowrap"
                }`}
              >
                {model}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Input Container */}
      <div className="flex items-center gap-3 px-2 py-2 border border-zinc-800 bg-zinc-900 rounded-lg hover:border-zinc-700 transition-colors relative">
        {/* Plus Icon Button with Dropdown */}
        <div ref={optionsContainerRef} className="relative">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            disabled={isLoading || disabled}
            className="h-8 w-8 flex items-center justify-center flex-shrink-0 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[#00E87B] transition-colors disabled:opacity-50"
            title="More options"
          >
            <Plus className="h-5 w-5" />
          </button>

          {/* Options Dropdown */}
          {showOptions && (
            <div className="absolute -left-2 bottom-[calc(100%+8px)] mb-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg z-50">
              {OPTIONS.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
                      // Handle option click
                      console.log(`${option.id} clicked`);
                      setShowOptions(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs text-zinc-400 hover:bg-zinc-800 hover:text-[#00E87B] transition-colors flex items-center gap-2 whitespace-nowrap"
                  >
                    <IconComponent className="h-4 w-4" />
                    {option.label}
                  </button>
                );
              })}
            </div>
          )}
        </div>

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
