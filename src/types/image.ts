export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  style?: string;
  aspectRatio?: string;
  createdAt: Date;
  downloadUrl?: string;
}

export interface GenerationRequest {
  prompt: string;
  style?: string;
  aspectRatio?: AspectRatio;
  quality?: ImageQuality;
}

export interface GenerationResponse {
  success: boolean;
  imageUrl?: string;
  error?: string;
  metadata?: {
    model: string;
    processingTime: number;
    prompt: string;
  };
}

export type AspectRatio = "1:1" | "16:9" | "9:16" | "3:2" | "2:3" | "4:3" | "3:4";

export type ImageQuality = "standard" | "high" | "ultra";

export type GenerationStatus = "idle" | "generating" | "success" | "error";

export interface StyleOption {
  id: string;
  name: string;
  description: string;
  prompt: string;
}

export interface GenerationHistory {
  images: GeneratedImage[];
  lastGenerated?: Date;
}

export interface SystemPromptConfig {
  basePrompt: string;
  qualityModifiers: string;
  styleModifiers: Record<string, string>;
}