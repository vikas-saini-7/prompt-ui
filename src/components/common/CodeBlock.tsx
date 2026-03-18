"use client";

import { useState } from "react";
import { Copy, Check, Eye, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  code: string;
  language?: string;
  onPreview?: (code: string) => void;
}

export default function CodeBlock({
  code,
  language = "typescript",
  onPreview,
}: Props) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview(code);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden max-w-full">
      <div className="flex items-center justify-between bg-zinc-900 px-4 py-2">
        <span className="text-xs font-medium text-zinc-400">{language}</span>
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={handleCopy}
            className="h-6 gap-1 text-xs hover:bg-zinc-800"
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                Copy
              </>
            )}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handlePreview}
            className="h-6 gap-1 text-xs hover:bg-zinc-800 hover:text-[#00E87B]"
          >
            <Eye className="h-3 w-3" />
            Preview
          </Button>
        </div>
      </div>
      <div
        className={`relative bg-zinc-950 rounded-b-lg ${isExpanded ? "overflow-visible" : "overflow-hidden"}`}
      >
        <div
          className={`transition-all duration-300 ease-in-out ${
            isExpanded ? "max-h-none" : "max-h-48"
          } ${isExpanded ? "overflow-visible" : "overflow-hidden"}`}
        >
          <pre className="overflow-x-auto p-4 max-w-full">
            <code className="text-xs text-zinc-300 font-mono whitespace-pre">
              {code}
            </code>
          </pre>
        </div>
        {/* View More / View Less Button */}
        <button
          type="button"
          onClick={toggleExpand}
          className="w-full py-3 px-4 flex items-center justify-center gap-2 text-xs font-medium text-zinc-400 hover:text-[#00E87B] hover:bg-zinc-900/50 border-t border-zinc-800 transition-all duration-200 cursor-pointer"
        >
          <span>{isExpanded ? "View less" : "View more"}</span>
          <ChevronDown
            className={`h-4 w-4 transition-transform duration-300 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>
    </div>
  );
}
