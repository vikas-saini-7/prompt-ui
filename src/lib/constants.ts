import { Model, InputOption } from "@/types";
import { Upload, Camera } from "lucide-react";

export const MODELS: Model[] = [
  { id: "gpt-4", name: "GPT-4" },
  { id: "gpt-3.5", name: "GPT-3.5" },
  { id: "claude-3", name: "Claude 3" },
  { id: "claude-2", name: "Claude 2" },
  { id: "gemini", name: "Gemini Pro" },
];

export const INPUT_OPTIONS: InputOption[] = [
  { id: "upload", label: "Upload File", icon: Upload },
  { id: "camera", label: "Camera", icon: Camera },
];

export const THEME = {
  primary: "#00E87B",
  background: "#0F0F0F",
  darkBg: "#09090B",
  border: "#27272A",
  zinc900: "#18181B",
  zinc800: "#27272A",
};

export const ANIMATION_DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
};

export const API_TIMEOUT = 30000; // 30 seconds
