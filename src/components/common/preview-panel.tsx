"use client";

import { useState } from "react";
import { Code, Eye, Copy, Check, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  code?: string;
  isLoading?: boolean;
}

export default function PreviewPanel({ code }: Props) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [selectedFile, setSelectedFile] = useState("component.tsx");

  // Mock files list
  const files = ["component.tsx", "styles.css", "types.ts", "utils.ts"];

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
            Generate a component to see preview and code
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950">
      {/* Minimal Tab Navigation */}
      <div className="flex items-center gap-4 px-4 py-3 border-b border-zinc-800 flex-shrink-0 bg-zinc-900/50">
        <button
          onClick={() => setActiveTab("code")}
          className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors ${
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
          className={`flex items-center gap-2 text-xs font-medium px-2 py-1 rounded transition-colors ${
            activeTab === "preview"
              ? "text-[#00E87B] bg-zinc-800/50"
              : "text-zinc-400 hover:text-zinc-300"
          }`}
        >
          <Eye className="h-4 w-4" />
          Preview
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden min-h-0">
        {activeTab === "preview" ? (
          // Preview Tab - Full width
          <div className="w-full h-full overflow-auto p-4 bg-gradient-to-b from-zinc-950 to-black">
            <div className="bg-white rounded-lg p-6 min-h-96 flex flex-col">
              <div className="text-center text-zinc-600 mb-4">
                <p className="text-sm font-medium">Live Component Preview</p>
              </div>
              <div className="border-2 border-dashed border-zinc-300 rounded p-6 flex-1 flex items-center justify-center">
                <div className="text-center">
                  <p className="font-semibold text-zinc-800 mb-2">
                    Preview rendering...
                  </p>
                  <p className="text-xs text-zinc-500">
                    Component preview will appear here
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Code Tab - Split view with files list
          <div className="flex h-full w-full">
            {/* Files List - Left */}
            <div className="w-48 border-r border-zinc-800 bg-zinc-900 flex flex-col flex-shrink-0">
              <div className="h-10 px-3 border-b border-zinc-800 flex items-center">
                <p className="text-xs font-medium text-zinc-400">Files</p>
              </div>
              <div className="flex-1 overflow-y-auto">
                {files.map((file) => (
                  <button
                    key={file}
                    onClick={() => setSelectedFile(file)}
                    className={`w-full text-left px-3 py-2 text-xs font-medium flex items-center gap-2 transition-colors ${
                      selectedFile === file
                        ? "bg-zinc-800 text-[#00E87B]"
                        : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-900"
                    }`}
                  >
                    <FileText className="h-3.5 w-3.5 flex-shrink-0" />
                    <span className="truncate">{file}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Code Content - Right */}
            <div className="flex-1 flex flex-col min-w-0">
              <div className="h-10 flex items-center justify-between px-4 bg-zinc-900 border-b border-zinc-800 flex-shrink-0">
                <span className="text-xs font-medium text-zinc-400">
                  {selectedFile.split(".").pop() === "css"
                    ? "css"
                    : "typescript"}
                </span>
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
                      Copy
                    </>
                  )}
                </Button>
              </div>
              <pre className="flex-1 overflow-auto p-4 bg-zinc-950 min-h-0">
                <code className="text-xs text-zinc-300 font-mono">{code}</code>
              </pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
