import { Model, InputOption } from "@/types";
import { Upload, Camera } from "lucide-react";
import { MODELS_CONFIG } from "@/config/models.config";

// Convert model config to Model type for UI
export const MODELS: Model[] = Object.values(MODELS_CONFIG).map((model) => ({
  id: model.id,
  name: model.name,
  provider: model.provider,
  isAvailable: model.isAvailable,
}));

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
