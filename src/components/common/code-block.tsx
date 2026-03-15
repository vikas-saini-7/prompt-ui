"use client";

import { useState } from "react";
import { Copy, Check, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  code: string;
  language?: string;
}

export default function CodeBlock({ code, language = "typescript" }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
            className="h-6 gap-1 text-xs hover:bg-zinc-800"
          >
            <Eye className="h-3 w-3" />
            Preview
          </Button>
        </div>
      </div>
      <pre className="overflow-x-auto p-4 max-w-full">
        <code className="text-xs text-zinc-300 font-mono whitespace-pre">
          {code}
        </code>
      </pre>
    </div>
  );
}
