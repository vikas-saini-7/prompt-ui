"use client";

import { useState, Suspense } from "react";
import { Code, Eye, Copy, Check, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LiveProvider, LivePreview, LiveError } from "react-live";
import * as React from "react";
import { Fragment } from "react";
import { transformCodeForPreview } from "@/lib/preview-utils";

interface Props {
  code?: string;
  isLoading?: boolean;
}

// Fallback components for preview
const PreviewFallback = () => (
  <div className="flex items-center justify-center p-4 text-zinc-400 text-sm">
    <div className="animate-spin">⏳</div>
  </div>
);

const ErrorMessage = ({ message }: { message: string }) => (
  <div className="flex items-start gap-3 p-4 bg-amber-950 border border-amber-900 rounded text-amber-200 text-xs">
    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
    <div className="flex-1">
      <p className="font-semibold mb-1">Preview Error</p>
      <p className="text-amber-100/80 font-mono text-xs overflow-wrap">
        {message}
      </p>
    </div>
  </div>
);

// Placeholder code for initial preview
const PLACEHOLDER_CODE = `<h1>Hello World</h1>`;

// Scope for react-live - includes common utilities
const getPreviewScope = () => ({
  React,
  Fragment,
  // React hooks
  useState: React.useState,
  useEffect: React.useEffect,
  useCallback: React.useCallback,
  useMemo: React.useMemo,
  useRef: React.useRef,
  useReducer: React.useReducer,
  // Common utilities
  Object,
  Array,
  String,
  Number,
  Boolean,
  Math,
  Date,
  JSON,
  console,
});

export default function PreviewPanel({ code }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("code");
  const [transformedCode, setTransformedCode] = useState(PLACEHOLDER_CODE);
  const [codeError, setCodeError] = useState<string | null>(null);

  // Memoize transformation to avoid unnecessary recalculations
  const transformedCodeMemo = React.useMemo(
    () => (code ? transformCodeForPreview(code) : PLACEHOLDER_CODE),
    [code],
  );

  React.useEffect(() => {
    setTransformedCode(transformedCodeMemo);
  }, [transformedCodeMemo]);

  React.useEffect(() => {
    if (!code) {
      setCodeError(null);
      return;
    }

    try {
      // Log for debugging
      if (typeof window !== "undefined") {
        console.log("[Preview] Original code:", code.substring(0, 100) + "...");
        console.log(
          "[Preview] Transformed code:",
          transformedCodeMemo.substring(0, 100) + "...",
        );
        console.log("[Preview] Full transformed:", transformedCodeMemo);
      }
      setCodeError(null);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error);
      setCodeError(`Transform error: ${errorMsg}`);
      console.error("Preview transform error:", errorMsg);
    }
  }, [code, transformedCodeMemo]);

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950">
      {/* Tab Navigation */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-800 shrink-0 bg-zinc-900/50">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded transition-colors ${
            activeTab === "code"
              ? "text-[#00E87B] bg-zinc-800/50"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          <Code className="h-4 w-4" />
          Code
        </button>
        <button
          onClick={() => setActiveTab("preview")}
          className={`flex items-center gap-2 text-xs font-medium px-3 py-1.5 rounded transition-colors ${
            activeTab === "preview"
              ? "text-[#00E87B] bg-zinc-800/50"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>

        <div className="ml-auto">
          <Button
            size="sm"
            onClick={handleCopy}
            className={`h-7 gap-1 text-xs ${
              copied
                ? "bg-green-900 text-green-100 hover:bg-green-800"
                : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
            }`}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy Code
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === "code" ? (
          // Code Tab - Show code with syntax highlighting
          <div className="w-full h-full overflow-auto bg-zinc-950 flex flex-col">
            <pre className="flex-1 overflow-auto p-4 min-h-0">
              <code className="text-xs text-zinc-300 font-mono whitespace-pre-wrap">
                {code}
              </code>
            </pre>
          </div>
        ) : (
          // Preview Tab - Live Component Preview
          <div className="w-full h-full overflow-auto bg-linear-to-b from-zinc-950 via-zinc-900 to-black p-4">
            {codeError ? (
              <div className="p-4">
                <ErrorMessage message={codeError} />
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-linear-to-b from-zinc-950 via-zinc-900 to-black p-4">
                <span className="text-zinc-400 text-lg font-semibold">
                  Preview coming soon
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
