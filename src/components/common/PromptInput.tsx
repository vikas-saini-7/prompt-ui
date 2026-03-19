"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { Send, Plus, ChevronUp, ChevronDown } from "lucide-react";
import { MODELS, INPUT_OPTIONS } from "@/lib/constants";
import { Model } from "@/types";

interface Props {
  onSubmit: (prompt: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  selectedModel?: string;
  onModelChange?: (modelId: string) => void;
  models?: Model[];
  options?: typeof INPUT_OPTIONS;
  isProfileLoading?: boolean;
}

export default function PromptInput({
  onSubmit,
  isLoading = false,
  disabled = false,
  selectedModel: initialModel = "",
  onModelChange,
  models = MODELS,
  options = INPUT_OPTIONS,
  isProfileLoading = false,
}: Props) {
  const [prompt, setPrompt] = useState("");
  const [selectedModel, setSelectedModel] = useState(initialModel);
  const [showModels, setShowModels] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const modelContainerRef = useRef<HTMLDivElement>(null);
  const optionsContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Memoize current model display name
  const currentModelName = useMemo(() => {
    const model = models.find((m) => m.id === selectedModel);
    return model?.name || selectedModel;
  }, [selectedModel, models]);

  // Sync selectedModel state with initialModel prop
  useEffect(() => {
    if (initialModel && initialModel !== selectedModel) {
      setSelectedModel(initialModel);
    }
  }, [initialModel]);

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

  const handleModelChange = (modelId: string) => {
    setSelectedModel(modelId);
    onModelChange?.(modelId);
    setShowModels(false);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full relative">
      {/* Model Button */}
      <div
        ref={modelContainerRef}
        className="absolute left-0 bottom-[calc(100%+0px)]"
      >
        <button
          type="button"
          onClick={() => setShowModels(!showModels)}
          disabled={isLoading || disabled || isProfileLoading}
          className="bg-[#0F0F0F] flex items-center gap-2 px-2 py-1 text-xs text-zinc-400 hover:text-[#00E87B] transition-colors disabled:opacity-50"
        >
          {isProfileLoading ? (
            <div className="flex items-center gap-2">
              <span className="h-3 mb-1 w-24 bg-zinc-700 rounded animate-pulse" />
            </div>
          ) : (
            <>
              <span>{currentModelName}</span>
              {showModels ? (
                <ChevronUp className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </>
          )}
        </button>

        {showModels && (
          <div className="absolute left-0 bottom-full mb-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg z-50">
            {(() => {
              const openai = models.filter((m) => m.provider === "openai");
              const anthropic = models.filter(
                (m) => m.provider === "anthropic",
              );
              const groq = models.filter((m) => m.provider === "groq");

              return (
                <>
                  {groq.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        if (model.isAvailable) {
                          handleModelChange(model.id);
                        }
                      }}
                      disabled={!model.isAvailable}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors whitespace-nowrap disabled:cursor-not-allowed ${
                        selectedModel === model.id
                          ? "bg-[#00E87B] text-black"
                          : model.isAvailable
                            ? "text-zinc-400 hover:bg-zinc-800 hover:text-[#00E87B]"
                            : "text-zinc-500 opacity-40"
                      }`}
                      title={
                        !model.isAvailable ? "Model not available" : undefined
                      }
                    >
                      {model.name}
                    </button>
                  ))}
                  {groq.length > 0 && openai.length > 0 && (
                    <div className="border-t border-zinc-800" />
                  )}
                  {openai.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        if (model.isAvailable) {
                          handleModelChange(model.id);
                        }
                      }}
                      disabled={!model.isAvailable}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors whitespace-nowrap disabled:cursor-not-allowed ${
                        selectedModel === model.id
                          ? "bg-[#00E87B] text-black"
                          : model.isAvailable
                            ? "text-zinc-400 hover:bg-zinc-800 hover:text-[#00E87B]"
                            : "text-zinc-500 opacity-40"
                      }`}
                      title={
                        !model.isAvailable ? "Model not available" : undefined
                      }
                    >
                      {model.name}
                    </button>
                  ))}
                  {openai.length > 0 && anthropic.length > 0 && (
                    <div className="border-t border-zinc-800" />
                  )}
                  {anthropic.map((model) => (
                    <button
                      key={model.id}
                      type="button"
                      onClick={() => {
                        if (model.isAvailable) {
                          handleModelChange(model.id);
                        }
                      }}
                      disabled={!model.isAvailable}
                      className={`w-full text-left px-3 py-2 text-xs transition-colors whitespace-nowrap disabled:cursor-not-allowed ${
                        selectedModel === model.id
                          ? "bg-[#00E87B] text-black"
                          : model.isAvailable
                            ? "text-zinc-400 hover:bg-zinc-800 hover:text-[#00E87B]"
                            : "text-zinc-500 opacity-40"
                      }`}
                      title={
                        !model.isAvailable ? "Model not available" : undefined
                      }
                    >
                      {model.name}
                    </button>
                  ))}
                </>
              );
            })()}
          </div>
        )}
      </div>

      {/* Input Container */}
      <div
        onClick={() => inputRef.current?.focus()}
        className="flex items-center gap-3 px-2 py-2 border border-zinc-800 bg-zinc-900 rounded-lg hover:border-zinc-700 transition-colors relative cursor-text"
      >
        {/* Plus Icon Button with Dropdown */}
        <div ref={optionsContainerRef} className="relative">
          <button
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            disabled={isLoading || disabled}
            className="h-8 w-8 flex items-center justify-center shrink-0 rounded hover:bg-zinc-800 text-zinc-400 hover:text-[#00E87B] transition-colors disabled:opacity-50"
            title="More options"
          >
            <Plus className="h-5 w-5" />
          </button>

          {showOptions && (
            <div className="absolute -left-2 bottom-[calc(100%+8px)] mb-2 bg-zinc-900 border border-zinc-800 rounded-lg overflow-hidden shadow-lg z-50">
              {options.map((option) => {
                const IconComponent = option.icon;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => {
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
          ref={inputRef}
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
          className="h-8 w-8 flex items-center justify-center shrink-0 rounded bg-[#00E87B] text-black hover:bg-[#00E87B]/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 hover:scale-110 active:scale-95"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </form>
  );
}
