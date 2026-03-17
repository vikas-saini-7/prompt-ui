"use client";

import React from "react";
import { cn } from "@/lib/utils";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen bg-background">
      {/* Left side - Image/Branding */}
      <div className="hidden md:flex md:flex-col md:items-center md:justify-center md:bg-primary md:p-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary-foreground mb-4">
            Prompt UI
          </h1>
          <p className="text-primary-foreground/80 text-lg">
            Generate beautiful UI components with AI
          </p>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex flex-col items-center justify-center p-6 sm:p-8 bg-background">
        {children}
      </div>
    </div>
  );
}
