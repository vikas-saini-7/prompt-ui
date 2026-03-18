"use client";

import { useState } from "react";
import { Code, Eye, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  code?: string;
  isLoading?: boolean;
}

export default function PreviewPanel({ code }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("code");

  const handleCopy = async () => {
    if (code) {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!code) {
    return (
      <div className="flex items-center justify-center h-full w-full bg-zinc-950">
        <div className="text-center px-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-zinc-900 mx-auto mb-4">
            <Eye className="h-8 w-8 text-zinc-600" />
          </div>
          <p className="text-zinc-400 text-sm">
            Click "Preview" on a component to see code and preview
          </p>
        </div>
      </div>
    );
  }

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
          // Preview Tab - Beautiful code display
          <div className="w-full h-full overflow-auto p-4 bg-linear-to-b from-zinc-950 to-black">
            <div className="bg-zinc-900 rounded-lg border border-zinc-800 overflow-hidden">
              <div className="bg-zinc-800/50 px-4 py-3 border-b border-zinc-700">
                <p className="text-xs font-medium text-zinc-400">
                  Component Code
                </p>
              </div>
              <pre className="p-4 overflow-auto max-h-[calc(100vh-200px)]">
                <code className="text-xs text-zinc-300 font-mono whitespace-pre-wrap leading-relaxed">
                  {code}
                </code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
