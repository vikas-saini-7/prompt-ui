import { ChatMessage } from "@/types";

export const mockMessages: ChatMessage[] = [
  {
    id: "1",
    type: "ai",
    content:
      "Welcome to Prompt UI! I can help you generate beautiful UI components from natural language descriptions. Just describe what you want to build, and I'll generate the code for you instantly.",
    timestamp: new Date(),
  },
  {
    id: "2",
    type: "user",
    content:
      "Create a modern card component with an image, title, description, and a button",
    timestamp: new Date(Date.now() - 60000),
  },
  {
    id: "3",
    type: "ai",
    content: "Here's a beautiful card component for you:",
    code: `import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function Card() {
  return (
    <div className="max-w-sm rounded-lg border border-zinc-800 bg-zinc-950 overflow-hidden hover:border-[#00E87B] transition-colors">
      <img 
        src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e" 
        alt="Card image" 
        className="w-full h-48 object-cover"
      />
      <div className="p-6">
        <h3 className="text-lg font-semibold text-white mb-2">
          Modern Design
        </h3>
        <p className="text-sm text-zinc-400 mb-4">
          Create stunning components with minimal, clean design principles.
        </p>
        <button className="inline-flex items-center gap-2 bg-[#00E87B] text-black px-4 py-2 rounded-lg font-medium hover:bg-[#00E87B]/90 transition-colors">
          Learn More
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}`,
    timestamp: new Date(Date.now() - 30000),
  },
];
